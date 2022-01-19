// recuperiamo la libreria
const roslib = window.ROSLIB;
// instanziamo il client ROS
const ros = new roslib.Ros();

const Topic = window.ROSLIB.Topic;

// Metodi per collegarsi ai vari eventi
ros.on('error', function (error) {
    console.log('error');
});

ros.on('connection', function () {
    console.log('Connection made!');
});
ros.on('close', function () {
    console.log('Connection closed.');
});

// Connessione con il server avviato in precedenza
ros.connect('ws://localhost:9090');

let allTopics = [];

const setTopics = (topics) => {
    allTopics = topics || [];
}

let topicInstances = [];

const addTopicInstances = (instances) => {
    topicInstances = [...topicInstances, ...instances];
}

const clearSubscriptions = () => {
    topicInstances.forEach(instance => instance.unsubscribe());
    topicInstances = [];
}

export {
    ros, Topic, allTopics, setTopics, topicInstances, addTopicInstances, clearSubscriptions
}