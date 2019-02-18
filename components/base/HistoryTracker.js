const handlerMap = {};

const noop = function() {};

typeof window != 'undefined' && window.addEventListener('popstate', function(event) {
	if(event.state && event.state.eventId && handlerMap[event.state.eventId]) {
		handlerMap[event.state.eventId]();
		delete handlerMap[event.state.eventId];
	}
});

class HistoryTracker {

	static trace(context, injectMethod) {
		var now = Date.now();
		var eventId = context._uid +  now;
		var ofn = context[injectMethod];
		window.history.replaceState({eventId: eventId}, '', '');
		window.history.pushState({_: now}, '', '');
		context[injectMethod] = function() {
			ofn.call(context);
			window.history.back();
			context[injectMethod] = ofn;
			ofn = noop;
		}
		
		handlerMap[eventId] = function() {
			ofn.call(context);
			ofn = noop;	
		}
	}

}

export default HistoryTracker;