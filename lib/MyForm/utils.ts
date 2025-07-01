type ClassValue = string | number | boolean | undefined | null | ClassDictionary;
interface ClassDictionary {
	[key: string]: boolean | undefined | null;
}

export function clsx(...args: ClassValue[]): string {
	const classes: string[] = [];

	for (const arg of args) {
		if (!arg) continue;

		if (typeof arg === 'string' || typeof arg === 'number') {
			classes.push(String(arg));
		} else if (Array.isArray(arg)) {
			const inner = clsx(...arg);
			if (inner) {
				classes.push(inner);
			}
		} else if (typeof arg === 'object') {
			for (const key in arg) {
				if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
					classes.push(key);
				}
			}
		}
	}

	return classes.join(' ');
}

export function debounce<T extends (...args: any[]) => any = () => void>(callback: T, wait_ms: number) {
	let timeoutId: NodeJS.Timeout;

	const func = (...args: Parameters<T>) => {
		if (wait_ms <= 0) {
			callback(...args);
			return;
		}

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => callback(...args), wait_ms);
	};

	func.immediate = (...args: Parameters<T>) => callback(...args);
	func.cancel = () => clearTimeout(timeoutId);

	return func;
}

function _isEqual(a: any, b: any, seen = new WeakMap()): boolean {
	if (Object.is(a, b)) return true;

	if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
		return false;
	}

	// Prevent infinite recursion for circular refs
	if (seen.has(a)) {
		return seen.get(a) === b;
	}
	seen.set(a, b);

	// Compare constructors
	if (a.constructor !== b.constructor) return false;

	// Handle Arrays
	if (Array.isArray(a)) {
		if (a.length !== b.length) return false;
		return a.every((val, i) => _isEqual(val, b[i], seen));
	}

	// Handle Map
	if (a instanceof Map) {
		if (a.size !== b.size) return false;
		for (const [key, val] of a) {
			if (!b.has(key) || !_isEqual(val, b.get(key), seen)) return false;
		}
		return true;
	}

	// Handle Set
	if (a instanceof Set) {
		if (a.size !== b.size) return false;
		for (const val of a) {
			// Sets are unordered, so check if equivalent value exists
			let found = false;
			for (const bVal of b) {
				if (_isEqual(val, bVal, seen)) {
					found = true;
					break;
				}
			}
			if (!found) return false;
		}
		return true;
	}

	// Handle Date
	if (a instanceof Date) return a.getTime() === b.getTime();

	// Handle RegExp
	if (a instanceof RegExp) return a.toString() === b.toString();

	// Generic objects
	const keysA = Reflect.ownKeys(a);
	const keysB = Reflect.ownKeys(b);
	if (keysA.length !== keysB.length) return false;

	for (const key of keysA) {
		if (!keysB.includes(key)) return false;
		if (!_isEqual(a[key], b[key], seen)) return false;
	}

	return true;
}

export function isEqual(a: any, b: any) {
	return _isEqual(a, b);
}

export function get(obj: any, path: string): any {
	switch (true) {
		case obj === undefined:
		case path === undefined:
		case obj === null:
		case path === null:
		case path === '':
			return undefined;
	}

	try {
		while (obj && path) {
			let curPath: string | number = path.split('.')[0];
			path = path.substring(curPath.length + 1);
			const index = parseInt(curPath);
			if (!Number.isNaN(index)) curPath = index;
			obj = obj[curPath];
		}
		return obj;
	} catch {
		return undefined;
	}
}
