function dataURLtoBlob(dataurl: string): Blob {
	const arr = dataurl.split(',');
	if (arr.length !== 2) {
		throw new Error('Invalid data URL format');
	}
	const mime = arr[0].match(/:(.*?);/)![1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new Blob([u8arr], { type: mime });
}
