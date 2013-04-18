module.exports = (function () {
	function Perform(actions) {
		this.parallel = Perform.prototype.parallel;
		this.callback = Perform.prototype.callback;
		this.running = Perform.prototype.running;

		this.actions = Array.prototype.slice.call(arguments, 0);
		childActions.apply(this, arguments);

		this.actionsOriginal = this.actions.slice(0);
		this.actionsCompleted = 0;
	}

	Perform.prototype = {
		parallel: false,
		callback: function (error) {
			if (error) { throw error; }
		},
		running: false,

		actions: null,
		actionsOriginal: null,
		actionsCompleted: 0,
		actionComplete: function () {
			if (!this.running) { return; }

			this.actionsCompleted++;

			// all actions completed
			if (this.actionsCompleted >= this.actions.length) {
				this.callback.call(this);
			}
			// actions still left to do, and not parallel
			else if (!this.parallel) {
				runAction.call(this, this.actions[this.actionsCompleted]);
			}

			return this;
		},

		add: function (actions) {
			if (!this.running) { return; }

			this.actions.dirty=true;
			
			this.actions=[].concat(
				this.actions.slice(0, this.actionsCompleted+1),
				Array.prototype.slice.call(arguments, 0),
				this.actions.slice(this.actionsCompleted+1)
			);

			childActions.apply(this, arguments);
			
			if (this.parallel) {
				runActions.call(this, arguments);
			}

			return this;
		},

		end: function (error) {
			if (!this.running) { return; }
			this.running = false;

			if(this.bubble && this.parent){ // bubble up to parent
				this.parent.end(error);
			}
			else{
				this.callback.call(this, error);
			}
			this.bubble=true; // reset bubble
			
			return this;
		},
		
		bubble:true,
		cancelBubble:function(){
			this.bubble=false;
		},

		run: function (callback) {
			if (this.running) { return; }

			if (callback) { this.callback = callback; }

			if(this.actions.dirty){
				this.actions = this.actionsOriginal.slice(0);
			}

			if (!this.actions || this.actions.length <= 0) {
				this.callback.call(this, new Error("No actions to perform."));
				return;
			}

			this.actionsCompleted = 0;
			this.running = true;

			if (this.parallel) {
				runActions.call(this, this.actions);
			}
			else {
				runAction.call(this, this.actions[this.actionsCompleted]);
			}

			return this;
		}
	};

	
	function runAction(action) {
		var control = this;

		if (action instanceof Perform) {
			action.run(function () {
				control.actionComplete();
			});
		}
		else if (action instanceof Function) {
			action.call(control);
		}
		else {
			control.end(new Error("Action not a function or Perform object ("+(action)+").", action));
		}
	}

	var runActions = (function () {
		var i, l;

		return function runActions(actions) {
			for (i = 0, l = actions.length; i < l; i++) {
				runAction.call(this, actions[i]);
			}
		};
	})();

	var childActions=(function(){
		var i, l;
		
		return function childActions(actions){
			for(i=0, l=arguments.length; i<l;i++){
				if(arguments[i] instanceof Perform){
					arguments[i].parent=this;
				}
			}
		};
	})();
	
	
	
	Perform.serial = function Perform_serial(actions) {
		Perform.apply(this, arguments);
	};
	Perform.serial.prototype = Object.create(Perform.prototype);

	Perform.parallel = function Perform_parallel(actions) {
		Perform.apply(this, arguments);
		this.parallel = true;
	};
	Perform.parallel.prototype = Object.create(Perform.prototype);

	return Perform;
})();
