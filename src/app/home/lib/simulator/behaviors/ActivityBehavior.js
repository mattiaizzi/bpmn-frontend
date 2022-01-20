import { ros, Topic, allTopics, addTopicInstances } from '../../util/RosClient';
import {
  isMessageFlow,
  isSequenceFlow
} from './ModelUtil';


export default function ActivityBehavior(simulator, scopeBehavior) {
  this._simulator = simulator;
  this._scopeBehavior = scopeBehavior;

  const elements = [
    'bpmn:BusinessRuleTask',
    'bpmn:CallActivity',
    'bpmn:ManualTask',
    'bpmn:ScriptTask',
    'bpmn:SendTask',
    'bpmn:ServiceTask',
    'bpmn:Task',
    'bpmn:UserTask'
  ];

  for (const element of elements) {
    simulator.registerBehavior(element, this);
  }
}

ActivityBehavior.prototype.signal = function(context) {

  this._triggerMessages(context);

  this._simulator.exit({
    ...context,
    signal: true
  });
};

ActivityBehavior.prototype.enter = function(context) {

  const {
    element,
    scope,
  } = context;

  const pool = scope.parent.element;
  let prefix = '';
  if(pool && pool.type === 'bpmn:Participant') {
    prefix = `/${pool.businessObject.name}`;
  }

  const availableTopics = allTopics.reduce((obj, topic) => ({
    ...obj,
    [topic.key]: new Topic({
      ros : ros,
      name : `${prefix}${topic.name}` ,
      messageType : topic.messageType,
      })
  }), {});

  addTopicInstances(Object.values(availableTopics));

  if (element.businessObject && element.businessObject.script) {
    const args = 'topics';
    const body = element.businessObject.script;

    const fn = new Function(args, body);

    try {
      const result = fn(availableTopics);
    } catch (error) {
      console.error(`Errore durante l'esecuzione dello script ${body}`, error);
    }
  }

  const {
    wait
  } = this._simulator.getConfig(element);

  const waiting = element.incoming.find(isMessageFlow);

  if (wait || waiting) {
    return;
  }

  this._triggerMessages(context);

  this._simulator.exit(context);
};

ActivityBehavior.prototype.exit = function(context) {

  const {
    element,
    scope
  } = context;

  if (scope.interrupted) {
    return;
  }

  // TODO(nikku): if a outgoing flow is conditional,
  //              task has exclusive gateway semantics,
  //              else, task has parallel gateway semantics

  const parentScope = scope.parent;


  for (const outgoing of element.outgoing) {

    if (isSequenceFlow(outgoing)) {

      this._simulator.enter({
        element: outgoing,
        scope: parentScope
      });
    }
  }
};


ActivityBehavior.prototype._triggerMessages = function(context) {

  const {
    element
  } = context;

  for (const outgoing of element.outgoing) {

    if (isMessageFlow(outgoing)) {
      this._simulator.signal({
        element: outgoing
      });
    }
  }

};

ActivityBehavior.$inject = [ 'simulator', 'scopeBehavior' ];