/* global Liferay */

import axios from 'axios';
import {config} from "./constants";
import {getSelectedLanguage, showError} from "./util";


export function getServerUrl() {
	return Liferay.OAuth2Client.FromUserAgentApplication(config.agentOauthAppId)
		.homePageURL;
}

export async function getOAuthToken() {
	const prom = new Promise((resolve, reject) => {
		Liferay.OAuth2Client.FromUserAgentApplication(config.agentOauthAppId)
			._getOrRequestToken()
			.then(
				(token) => {
					resolve(token.access_token);
				},
				(error) => {
					showError('Error', error);

					reject(error);
				}
			)
			.catch((error) => {
				showError('Error', error);

				reject(error);
			});
	});

	return prom;
}

export async function oAuthRequest(config) {
	return request({
		headers: {
			Authorization: `Bearer ${await getOAuthToken()}`,
		},
		...config,
	});
}

export function request(config) {
	return new Promise((resolve, reject) => {
		axios
			.request({
				headers: {
					'x-csrf-token': Liferay.authToken,
					'Accept-Language': getSelectedLanguage(),
				},
				method: 'get',
				...config,
			})
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject({error, message: error || ''});
			});
	});
}
