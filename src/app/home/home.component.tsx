import { useEffect, useState } from "react";
import InputFile from "../components/input-file/input-file.components";
import TokenSimulationModule from './lib/viewer';
import React from "react";
import { Button, Grid } from "@mui/material";

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
    const [file, setFile] = useState<File | undefined>();
    const handleChange = (file: File) => {
        setFile(file);
        getFile(file).then((xml: any) => setDiagram(xml));
    }

    const diagramSection = diagram ? (<>
        <Grid item xs={12}>
            {file && file.name}
        </Grid>
        <Grid item xs={12}>
            <Viewer diagram={diagram} />
        </Grid>
    </>) : null;

    return <Grid container spacing={1}>
        <Grid item xs={12}>
            <InputFile label="Carica diagramma BPMN" onChange={handleChange} />
        </Grid>
        {diagramSection}

    </Grid>
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


class Viewer extends React.Component<{ diagram: string }> {
    viewer;
    generateId;
    diagramXML;
    _mounted = false;
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
            <div id={this.generateId} style={{ display: "none" }} />
            <Button onClick={() => { document.getElementById('play-this')?.click(); }}>Avvia simulazione</Button>
        </>
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidUpdate(prevProps: any) {
        // import function
        function importXML(xml: any, Viewer: any) {
            Viewer.importXML(xml).then((d: any) => console.log('init', xml));
        }

        if (prevProps.diagram !== this.props.diagram) {
            this.diagramXML = this.props.diagram;
            if (this.diagramXML && this._mounted) {
                this.viewer.attachTo("#" + this.generateId);
                importXML(this.diagramXML, this.viewer);
            }
        }
    }

    componentDidMount() {
        this._mounted = true;
        this.viewer.attachTo("#" + this.generateId);

        // import function
        function importXML(xml: any, Viewer: any) {
            Viewer.importXML(xml).then((d: any) => console.log('init', xml));
        }

        importXML(this.diagramXML, this.viewer);
    }
}
export default Home;