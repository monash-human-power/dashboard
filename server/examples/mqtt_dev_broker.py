#!/usr/bin/env python3
"""
Local MQTT broker on port 1883 plus repeating sample messages for the dashboard.

Matches topics handled in server/js/sockets.py and payloads expected by V4 views
(V4SpeedDistanceChart, V4LocationMap, DASRecording WM channels).

Usage (from repo root or this folder):
  pip install -r server/examples/requirements-mqtt-dev.txt
  python server/examples/mqtt_dev_broker.py

Then run the Node server and the React client, open the V4 dashboard (/v4).

Stop with Ctrl+C.

Broker selection (first match wins):
  1. Mosquitto on PATH (recommended on Windows — e.g. https://mosquitto.org/download/)
  2. Embedded Python broker (`pip install amqtt`) if Mosquitto is not found

If you already run a broker on 1883, use:  python .../mqtt_dev_broker.py --no-broker
"""

from __future__ import annotations

import argparse
import asyncio
import importlib.util
import json
import os
import shutil
import signal
import subprocess
import sys
import threading
import time
from typing import Any, Optional

import paho.mqtt.client as mqtt

BROKER_HOST = "127.0.0.1"
DEFAULT_PORT = 1883


def _gps_payload(lat: float, lon: float, speed_ms: float = 2.5) -> dict[str, Any]:
    return {
        "speed": speed_ms,
        "pdop": 1.2,
        "latitude": lat,
        "longitude": lon,
        "altitude": 50.0,
        "course": 90.0,
        "datetime": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def _wm_data_module(sensors: list[dict[str, Any]]) -> str:
    return json.dumps({"sensors": sensors})


def _v4_sensor_data(ant_speed_ms: float, ant_distance_m: float) -> str:
    return json.dumps(
        {
            "sensors": [
                {"type": "antSpeed", "value": ant_speed_ms},
                {"type": "antDistance", "value": ant_distance_m},
            ]
        }
    )


def _start_amqtt_broker(port: int, stop: threading.Event) -> None:
    from amqtt.broker import Broker

    async def _run() -> None:
        config = {
            "listeners": {
                "default": {
                    "type": "tcp",
                    "bind": f"0.0.0.0:{port}",
                },
            },
        }
        broker = Broker(config)
        await broker.start()
        try:
            while not stop.is_set():
                await asyncio.sleep(0.2)
        finally:
            await broker.shutdown()

    asyncio.run(_run())


def _start_mosquitto_subprocess(port: int) -> Optional[subprocess.Popen]:
    exe = shutil.which("mosquitto")
    if not exe:
        return None
    # -v useful for debugging; drop if too noisy
    return subprocess.Popen(
        [exe, "-p", str(port), "-v"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def _wait_for_port(host: str, port: int, timeout_s: float = 8.0) -> bool:
    deadline = time.monotonic() + timeout_s
    import socket

    while time.monotonic() < deadline:
        try:
            with socket.create_connection((host, port), timeout=0.5):
                return True
        except OSError:
            time.sleep(0.15)
    return False


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.environ.get("MQTT_PORT", DEFAULT_PORT)),
        help=f"MQTT TCP port (default {DEFAULT_PORT}, same as server local broker)",
    )
    parser.add_argument(
        "--host",
        default=BROKER_HOST,
        help="Broker bind / connect address",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=1.0,
        help="Seconds between telemetry publishes",
    )
    parser.add_argument(
        "--no-broker",
        action="store_true",
        help="Do not start a broker; connect to an existing one on --host/--port",
    )
    parser.add_argument(
        "--embedded-broker",
        action="store_true",
        help="Force embedded amqtt broker (skip Mosquitto even if installed)",
    )
    args = parser.parse_args()

    stop_broker = threading.Event()
    broker_thread: Optional[threading.Thread] = None
    mosq_proc: Optional[subprocess.Popen] = None

    def shutdown(*_: Any) -> None:
        stop_broker.set()
        if mosq_proc and mosq_proc.poll() is None:
            mosq_proc.terminate()

    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    if not args.no_broker:
        if _wait_for_port(args.host, args.port, timeout_s=0.3):
            print(
                f"Port {args.port} already accepts connections; using that broker "
                "(not starting a new one).",
                flush=True,
            )
        else:
            started = False
            if not args.embedded_broker:
                mosq_proc = _start_mosquitto_subprocess(args.port)
                if mosq_proc:
                    time.sleep(0.5)
                    if mosq_proc.poll() is None:
                        print("Started Mosquitto subprocess.", flush=True)
                        started = True
                    else:
                        mosq_proc = None
            if not started and importlib.util.find_spec("amqtt") is not None:
                broker_thread = threading.Thread(
                    target=_start_amqtt_broker,
                    args=(args.port, stop_broker),
                    daemon=True,
                    name="amqtt",
                )
                broker_thread.start()
                print("Started embedded broker (amqtt).", flush=True)
                started = True
            if not started:
                print(
                    "Could not start a broker. Options:\n"
                    "  • Install Mosquitto and add mosquitto.exe to PATH, or\n"
                    "  • pip install amqtt   (see server/examples/requirements-mqtt-dev.txt), or\n"
                    "  • Run your own broker, then:  python mqtt_dev_broker.py --no-broker\n",
                    file=sys.stderr,
                )
                sys.exit(1)

            if not _wait_for_port(args.host, args.port):
                print(
                    f"Broker did not open {args.host}:{args.port} in time.",
                    file=sys.stderr,
                )
                shutdown()
                sys.exit(1)
    else:
        print(f"Using existing broker at {args.host}:{args.port} (--no-broker).", flush=True)

    client_id = f"mqtt_dev_{os.getpid()}_{int(time.time())}"
    client = mqtt.Client(
        client_id=client_id,
        clean_session=True,
        protocol=mqtt.MQTTv311,
    )
    client.connect(args.host, args.port, keepalive=30)
    client.loop_start()

    t0 = time.monotonic()
    burst_done = False

    print(
        f"Publishing sample data to {args.host}:{args.port} every {args.interval}s "
        "(Ctrl+C to stop).",
        flush=True,
    )

    try:
        while True:
            if stop_broker.is_set():
                break
            now = time.monotonic() - t0

            if not burst_done:
                # V4 chart listens for V4-start; map resets on wireless_module-3-start
                client.publish("/v4/start", json.dumps({"start": True}), qos=0)
                client.publish("/v3/wireless_module/3/start", "{}", qos=0)
                for mid in (1, 2, 3, 4, 5):
                    client.publish(
                        f"/v3/wireless_module/{mid}/status",
                        json.dumps({"online": True}),
                        qos=0,
                    )
                burst_done = True
                print("Sent /v4/start, WM3 start, WM 1-5 online status.", flush=True)

            # V4 speed/distance chart: useSensorData(null, …) -> V4-sensors-data
            dist = round(now * 2.0, 2)
            speed_ms = 3.0 + 0.5 * (now % 10)
            client.publish(
                "/v4/sensor_module/data",
                _v4_sensor_data(speed_ms, dist),
                qos=0,
            )

            # V4 map: GPS on wireless module 3
            lat = -37.877 + (now * 0.00005) % 0.01
            lon = 145.045 + (now * 0.00007) % 0.01
            client.publish(
                "/v3/wireless_module/3/data",
                _wm_data_module(
                    [{"type": "gps", "value": _gps_payload(lat, lon, speed_ms)}]
                ),
                qos=0,
            )

            # Optional: legacy DAS "data" channel (query-string style)
            client.publish(
                "data",
                f"reedVelocity={speed_ms * 3.6}&reedDistance={dist}&filename=test.csv",
                qos=0,
            )

            # Light on status tree (shows up as status channels in UI)
            client.publish(
                "status/dev/python_sim/heartbeat",
                json.dumps({"ticks": int(now), "ok": True}),
                qos=0,
            )

            if stop_broker.wait(timeout=args.interval):
                break

    finally:
        client.loop_stop()
        client.disconnect()
        stop_broker.set()
        if broker_thread and broker_thread.is_alive():
            broker_thread.join(timeout=3.0)
        if mosq_proc and mosq_proc.poll() is None:
            mosq_proc.terminate()
            try:
                mosq_proc.wait(timeout=2.0)
            except subprocess.TimeoutExpired:
                mosq_proc.kill()


if __name__ == "__main__":
    main()
