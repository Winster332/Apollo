export const splitBy = (n: number, nonBreakable: boolean) => (value: string) => {
	const reversedString = value.split('').reverse().join('');
	const ret: Array<string> = [];
	let i;
	let len;

	for (i = 0, len = value.length; i < len; i += n) {
		ret.push(reversedString.substr(i, n).split('').reverse().join(''));
	}

	const delimiter = nonBreakable ? '\u00A0' : ' ';

	return ret.reverse().join(delimiter);
};

export const splitByThree = splitBy(3, false);
export const splitByThreeNbsp = splitBy(3, true);

export const asRoubles = (n: number) => splitByThreeNbsp(n.toFixed()) + '₽';
export const asNumber = (n: number) => splitByThreeNbsp(n.toFixed());
