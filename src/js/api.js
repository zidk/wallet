
const API_SERVER_INFO = {
    'host': 'http://localhost',
    'port' : '5000',
}

const API_URL = API_SERVER_INFO.host + ":" + API_SERVER_INFO.port

export function API (method, endpoint, path, data){
    data = data || undefined;
    path = path || undefined;
    const fullpath = path ? `${endpoint}/${path}` : endpoint;

    const fetch = process.browser ? window.fetch : require('node-fetch').default;

	const opts = { method, headers: {} };

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
    }

    return fetch(`${API_URL}/${fullpath}`, opts)
    .then(r => r.text())
    .then(json => {
        try {
            return JSON.parse(json);
        } catch (err) {
            return json;
        }
    });   
}
