import compact from 'lodash-es/compact';
import concat from 'lodash-es/concat';
import difference from 'lodash-es/difference';
import differenceBy from 'lodash-es/differenceBy';
import every from 'lodash-es/every';
import filter from 'lodash-es/filter';
import find from 'lodash-es/find';
import findIndex from 'lodash-es/findIndex';
import flatMap from 'lodash-es/flatMap';
import groupBy from 'lodash-es/groupBy';
import includes from 'lodash-es/includes';
import intersection from 'lodash-es/intersection';
import intersectionBy from 'lodash-es/intersectionBy';
import keys from 'lodash-es/keys';
import map from 'lodash-es/map';
import max from 'lodash-es/max';
import min from 'lodash-es/min';
import orderBy from 'lodash-es/orderBy';
import partition from 'lodash-es/partition';
import range from 'lodash-es/range';
import reduce from 'lodash-es/reduce';
import remove from 'lodash-es/remove';
import reverse from 'lodash-es/reverse';
import some from 'lodash-es/some';
import sortBy from 'lodash-es/sortBy';
import sum from 'lodash-es/sum';
import sumBy from 'lodash-es/sumBy';
import take from 'lodash-es/take';
import toPairs from 'lodash-es/toPairs';
import union from 'lodash-es/union';
import uniq from 'lodash-es/uniq';
import uniqBy from 'lodash-es/uniqBy';
import values from 'lodash-es/values';
import zip from 'lodash-es/zip';

export interface Grouping<TK, T> {
	key: TK;
	items: T[];
}

export class Collections {
	static readonly find = find;
	static readonly zip: <T1, T2>(left: T1[], right: T2[]) => [T1, T2][] = zip;
	static readonly compact = compact;
	static readonly concat = concat;
	static readonly flatMap = flatMap;
	static readonly map = map;
	static readonly includes = includes;
	static readonly sortBy = sortBy;
	static readonly groupBy = groupBy;
	static readonly orderBy = orderBy;
	static readonly range = range;
	static readonly keys = keys;
	static readonly findIndex = findIndex;
	static readonly partition = partition;
	static readonly sumBy = sumBy;
	static readonly intersection = intersection;
	static readonly intersectionBy = intersectionBy;
	static readonly uniqBy = uniqBy;
	static readonly reduce = reduce;
	static readonly remove = remove;
	static readonly max = max;
	static readonly min = min;
	static readonly uniq = uniq;
	static readonly some = some;
	static readonly sum = sum;
	static readonly reverse = reverse;
	static readonly union = union;
	static readonly every = every;
	static readonly difference = difference;
	static readonly differenceBy = differenceBy;
	static readonly take = take;
	static readonly toPairs = toPairs;

	static chain = <T>(input: T[]) => {
		return new ChainArrayWrapper(input);
	};

	static groupByString = <T>(
		items: T[],
		key: (obj: T) => string
	): Grouping<string, T>[] => {
		const resMap = groupBy(items, x => key(x));
		return keys(resMap).map(k => ({ key: k, items: resMap[k] }));
	};

	static distinctByString = <T>(
		items: T[],
		key: (obj: T) => string
	): string[] => {
		return Collections.groupByString(items, key).map(x => x.key);
	};

	static groupByObject = <T, TK>(
		items: T[],
		key: (obj: T) => TK,
		keyString: (k: TK) => string
	): Grouping<TK, T>[] => {
		return Collections.groupByString(items, x => keyString(key(x)))
			.map(x => ({
				key: key(x.items[0]),
				items: x.items
			}));
	};

	static distinctByObject = <T, TK>(
		items: T[],
		key: (obj: T) => TK,
		keyString: (k: TK) => string
	): TK[] => {
		return Collections.groupByObject(items, key, keyString).map(x => x.key);
	};

	/* intersperse: Return an array with the separator interspersed between
	* each element of the input array.
	*
	* > _([1,2,3]).intersperse(0)
	* [1,0,2,0,3]
	*/
	static intersperse = <T>(arr: T[], sep: T) => {
		if (arr.length === 0) {
			return [];
		}

		return arr
			.slice(1)
			.reduce((xs, x) => xs.concat([sep, x]), [arr[0]])
			.map((e, i) => ({ ...(e as any as T), key: i }));
	};

	static first = <T>(arr: T[], f: (i: T) => boolean) => {
		const found = arr.filter(f);
		if (found.length === 0){
			throw 'not found required item';
		}
		return found[0];
	};
}

type ListIterator<T, TResult> = (value: T, index: number, collection: T[]) => TResult;
type ListArrayIterator<T, TResult> = (value: T, index: number, collection: T[]) => TResult[];

interface Dictionary<T> {
	[index: string]: T;
}

export class ChainDictionaryWrapper<T> {
	constructor(
		private dictionary: Dictionary<T[]>
	) { }

	map = <TResult>(iterator: (value: T[], key: string) => TResult) => {
		return new ChainArrayWrapper(map(this.dictionary, iterator));
	};

	toPairs = () => {
		return new ChainArrayWrapper(toPairs(this.dictionary));
	};

	value = () => {
		return this.dictionary;
	};

	values = () => {
		return new ChainArrayWrapper(values(this.dictionary));
	};
}

export class ChainArrayWrapper<T> {
	private values: T[];
	constructor(
		values: T[]
	) {
		this.values = values;
	}

	concat = (values: T[]) => new ChainArrayWrapper(concat(this.values, values));

	map = <TResult>(iterator: ListIterator<T, TResult>) =>
		new ChainArrayWrapper(map(this.values, iterator));

	groupBy = <TKey>(iterator: ListIterator<T, TKey>) =>
		new ChainDictionaryWrapper<T>(groupBy(this.values, iterator) as Dictionary<T[]>);

	difference = (
		...values: T[][]
	) => new ChainArrayWrapper(difference(this.values, ...values));

	differenceBy = (
		values: T[],
		iteratee: ((value: T) => any) | string) => new ChainArrayWrapper(differenceBy(this.values, values, iteratee));

	sortBy = (...iteratees: (ListIterator<T, unknown> | string)[]) => new ChainArrayWrapper(sortBy(this.values, iteratees));

	flatMap = <TResult>(iteratee: ListArrayIterator<T, TResult>) => new ChainArrayWrapper(flatMap(this.values, iteratee));

	distinctByObject = <TK>(
		key: (obj: T) => TK,
		keyString: (k: TK) => string
	) => new ChainArrayWrapper(Collections.distinctByObject(this.values, key, keyString));

	uniq = () => new ChainArrayWrapper(uniq(this.values));

	uniqBy = (iteratee: (arg: T) => unknown) => new ChainArrayWrapper(uniqBy(this.values, iteratee));

	sum = () => sum(this.values);

	filter = (iteratee: ListIterator<T, boolean | null>) => new ChainArrayWrapper<T>(filter(this.values, iteratee) as T[]);

	reverse = () => new ChainArrayWrapper(reverse(this.values));

	take = (count: number) => new ChainArrayWrapper(take(this.values, count));

	orderBy = (fieldSelector: string[] | ((val: T) => string) | ((val: T) => any)[], orders?: (boolean|'asc'|'desc')[]) =>
		new ChainArrayWrapper(orderBy(this.values, fieldSelector, orders) as any as T[]);

	value = () => this.values;

	first = () => this.values[0];
}

export const chain = <T>(input: T[]) => new ChainArrayWrapper(input);