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
    console.log(sender, args)
    var nodeArgs = args.getNode();
    console.log('nodeArgs', nodeArgs)
    // this.state.diagram.getFactory().createDiagramLink(this.state.rootNode, nodeArgs);
  }

  render() {
    return (
      <div>
        <DiagramView backBrush="#f0f0f0f0" showGrid={true} diagram={this.state.diagram} onNodeCreated={(sender, args) => this.onDiagramNodeCreated(sender, args)} />
      </div>
    )
  }
}

export default Diagram