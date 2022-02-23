// Сiя потрясающая заглушка посвящается тому, как реализован вызов require внутри @aspnetcore/signalr
if(typeof require === 'undefined') {
	require = () => {};
}