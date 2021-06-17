import { MAPPER } from '@shared/icons/mapper';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function iconsPath(staticPath: string): (name: string) => string {
	const base = staticPath[staticPath.length - 1] === '/' ? staticPath : staticPath + '/';
	return (name: string) => {
		if (name.startsWith('tuiIcon')) {
			return `${base}${name}.svg#${name}`;
		}
		return `assets/icons/${MAPPER[name]}.svg#${MAPPER[name]}`;
	};
};
