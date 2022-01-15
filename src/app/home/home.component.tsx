import { useEffect, useState } from "react";
import InputFile from "../components/input-file/input-file.components";
import TokenSimulationModule from './lib/viewer';
import React from "react";

function getFile(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
const Home = () => {
    const [diagram, setDiagram] = useState();

    const handleChange = (file: File) => {
        getFile(file).then((xml: any) => setDiagram(xml));
    }
    return <>
        <InputFile label="Carica diagramma BPMN" onChange={handleChange} />
        { diagram && <Viewer diagram={diagram}/>}
    </>
};

const BpmnViewer = require('bpmn-js').default;

const ExampleModule = {
    __init__: [
        ['eventBus', 'bpmnjs', 'toggleMode', function (eventBus: any, bpmnjs: any, toggleMode: any) {
            eventBus.on('diagram.init', 500, () => {
                toggleMode.toggleMode(true);
            });
        }]
    ]
};


class Viewer extends React.Component<{diagram: string}> {
    viewer;
    generateId;
    diagramXML;
    constructor(props: any) {
        super(props);
        this.viewer = new BpmnViewer({
            additionalModules: [
                ExampleModule,
                TokenSimulationModule
            ],
            keyboard: {
                bindTo: document
            }
        });
        this.generateId = "bpmnContainer" + Date.now();
        this.diagramXML = props.diagram;
    }

    render() {
        return <>
            <div id={this.generateId} style={{display: "none"}}/>
            <button onClick={() => { document.getElementById('play-this')?.click();}}>avvia</button>
        </>
    }
    componentDidMount() {
        this.viewer.attachTo("#" + this.generateId);

        // import function
        function importXML(xml: any, Viewer: any) {
            // import diagram
            Viewer.importXML(xml, function (err: any) {
                if (err) {
                    return console.error("could not import BPMN 2.0 diagram", err);
                }

                var canvas = Viewer.get("canvas"),
                    overlays = Viewer.get("overlays");

                // zoom to fit full viewport
                canvas.zoom("fit-viewport");

                // attach an overlay to a node
                overlays.add("SCAN_OK", "note", {
                    position: {
                        bottom: 0,
                        right: 0
                    },
                    html: '<div class="diagram-note">Mixed up the labels?</div>'
                });

                // add marker
                canvas.addMarker("SCAN_OK", "needs-discussion");
            });
        }

        importXML(this.diagramXML, this.viewer);
    }
}
export default Home;