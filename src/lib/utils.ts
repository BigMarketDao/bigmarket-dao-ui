export const COMMS_ERROR = 'Error communicating with the server. Please try later.';
export const smbp = 900;
export const xsbp = 700;

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
	// These options are needed to round to whole numbers if that's what you want.
	// minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	// maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const btcPrecision = 100000000;
const stxPrecision = 1000000;

export function bitcoinToSats(amountBtc: number) {
	return Math.round(amountBtc * btcPrecision);
}

export function fmtSatoshiToBitcoin(amountSats: number) {
	return (Math.round(amountSats) / btcPrecision).toFixed(8);
}

export function satsToBitcoin(amountSats: number): number {
	return Number((Math.round(amountSats) / btcPrecision).toFixed(8));
}

export function userSatBtc(amount: number, denomination: string): number {
	if (denomination === 'bitcoin') {
		if (amount.toString().indexOf('.') === -1) {
			return Number((Math.round(amount) / btcPrecision).toFixed(8));
		}
		return amount;
	} else {
		return bitcoinToSats(amount);
	}
}

export function fmtMicroToStxFormatted(amountStx: number) {
	const converted = amountStx / 1e6; // Divide by 10^6 to shift 6 decimal places
	const formatted = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 6,
		maximumFractionDigits: 6
	}).format(converted);

	console.log(formatted); // Outputs: "99,999,999.452471"

	return formatted;
}

export function fmtMicroToStx(amountStx: number) {
	const converted = amountStx / 1e6; // Divide by 10^6 to shift 6 decimal places
	return converted;
}

export function tsToTime(updated: number | undefined) {
	let d = new Date();
	if (updated) d = new Date(updated);
	//return d.toLocaleDateString('en-UK');
	return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

export function tsToDate(updated: number | undefined) {
	let d = new Date();
	if (updated) d = new Date(updated);
	return d.toLocaleDateString('en-UK');
	//return d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + "/" + d.getMonth() + 1 + "/" + d.getFullYear();
}

export function fmtAmount(amount: number, currency: string) {
	if (currency === 'stx') {
		return formatter.format(amount).replace('$', ''); // &#931;
	}
}

export function fmtNumberStacksFloor(amount: number | undefined) {
	if (!amount || amount === 0) return '0';
	return fmtNumber(Math.floor(Number(fmtMicroToStx(amount))));
}

export function fmtNumber(amount: number | undefined) {
	if (amount === 0) return '0';
	if (amount) return new Intl.NumberFormat().format(amount);
}

export function truncate(stringy?: string, amount?: number) {
	if (!stringy) return '?';
	if (!amount) amount = 4;
	return stringy.substring(0, amount) + '...' + stringy.substring(stringy.length - amount);
}

export function truncateEnd(stringy?: string, amount?: number) {
	if (!stringy) return '?';
	if (!amount) amount = 4;
	return '..' + stringy.substring(stringy.length - amount);
}

export function compareCurrencies(a: { value: string; name: string }, b: { value: string; name: string }) {
	if (a.value < b.value) {
		return -1;
	}
	if (a.value > b.value) {
		return 1;
	}
	return 0;
}

export function downloadCsv(data: any, filename: string) {
	// Creating a Blob for having a csv file format
	// and passing the data with type
	const blob = new Blob([data], { type: 'text/csv' });
	// Creating an object for downloading url
	const url = typeof window !== 'undefined' ? window.URL.createObjectURL(blob) : '';
	// Creating an anchor(a) tag of HTML
	const a = document.createElement('a');
	// Passing the blob downloading url
	a.setAttribute('href', url);
	// Setting the anchor tag attribute for downloading
	// and passing the download file name
	a.setAttribute('download', filename);
	// Performing a download with click
	a.click();
	return data;
}

export function csvMaker(inputData: Array<any>, fileName: string) {
	// Empty array for storing the values
	const csvRows = [];
	// Headers is basically a keys of an object
	// which is id, name, and profession
	const headers = Object.keys(inputData[0]);
	// As for making csv format, headers must
	// be separated by comma and pushing it
	// into array
	csvRows.push(headers.join(','));
	// Pushing Object values into array
	// with comma separation
	for (const vote of inputData) {
		csvRows.push(Object.values(vote).join(','));
	}
	// Returning the array joining with new line
	const data = csvRows.join('\n');
	downloadCsv(data, fileName);
}
