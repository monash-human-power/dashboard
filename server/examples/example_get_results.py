import requests

if __name__ == "__main__":
	base_url = 'http://das-web-server.herokuapp.com'

	# Get a result from the server
	result_endpoint = '/result'
	result_base_uri = base_url + result_endpoint
	result = requests.get(result_base_uri)
	output_result = result.json()
	print("SINGLE RESULT:")
	print(output_result)
	print()

	print("Result:")
	print(output_result['result'])
	print()

	print('Seconds of the result (secs):')
	print(output_result['result']['secs'])
	print()

	# Get all results from the server
	all_results_endpoint = '/result/all'
	all_results_base_uri = base_url + all_results_endpoint
	all_results = requests.get(all_results_base_uri)
	all_results.json()



