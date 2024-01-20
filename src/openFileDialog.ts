import './showOpenFilePickerPolyfill';

export default function openFileDialog(
    callbackfn: (content: string) => void,
    options?: (OpenFilePickerOptions & { multiple?: false | undefined }) | undefined,
) {
    global
        .showOpenFilePicker(options)
        .then(
            ([fileHandle]) => fileHandle.getFile(),
            (reason) => null,
        )
        .then((file) => (file ? file.text() : null))
        .then((content) => {
            if (content) {
                callbackfn(content);
            }
        });
}
