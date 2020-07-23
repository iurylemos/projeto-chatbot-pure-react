import React, { Component } from 'react';
import mf from 'diagram-library';
import { DiagramView } from 'diagram-library-react';

class Diagram extends Component {
  constructor(props) {
    super(props);

    var diagram = new mf.Diagramming.Diagram();

    var node = diagram.getFactory().createShapeNode(20, 20, 42, 42)
    node.setText("My Node")
    node.setBrush("pink")

    this.state = {
      diagram: diagram,
      rootNode: node
    }
  }

  onDiagramNodeCreated(sender, args) {
    console.log('onDiagramNodeCreated - sender', sender)
    console.log('onDiagramNodeCreated - args', args)
    var nodeArgs = args.getNode();
    console.log('nodeArgs', nodeArgs)
    // this.state.diagram.getFactory().createDiagramLink(this.state.rootNode, nodeArgs);
  }

  onDiagramNodeClicked(diagram, args) {
    console.log('onDiagramNodeClicked diagram', diagram)
    console.log('onDiagramNodeClicked args', args)
    console.log('args.getNode()', args.getNode())
  }

  onDiagramChanged(diagram) {
    console.log('onDiagramChanged', diagram)
  }

  render() {
    return (
      <div>
        <DiagramView routeLinks={true} allowInplaceEdit={true} onNodeClicked={(diagram, args) => this.onDiagramNodeClicked(diagram, args)} onSelectionModifying={true} backBrush="#f0f0f0f0" showGrid={true} diagram={this.state.diagram} onDiagramChanged={diagram => this.onDiagramChanged(diagram)} onNodeCreated={(sender, args) => this.onDiagramNodeCreated(sender, args)} />
      </div>
    )
  }
}

export default Diagram