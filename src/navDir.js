

import path from 'path';

const __dirname =
process.argv[1].replace(/\\/g, '/').split('/')
.slice(0, -1).join('/');

const navDir = toPath => {
	switch (toPath) {
		case undefined:
				return __dirname;
			  break;
		default:
			  return path.join(__dirname, toPath).replace(/\\/g, '/')
			  break;
	}
};

export default navDir;
