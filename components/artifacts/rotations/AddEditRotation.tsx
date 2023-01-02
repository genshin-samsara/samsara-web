import {Table} from "semantic-ui-react";
import React from "react";
import {AddEdit, AddEditSharedProperties, ArtifactRotationData, Rotation, ListManager} from "@/artifacts/types";
import {AddEditRotationPhase} from "@/artifacts/enums";
import AddEditRotationPrompt from "@/components/artifacts/rotations/AddEditRotationPrompt";
import AddEditRotationDomain from "@/components/artifacts//rotations/AddEditRotationDomain";
import AddEditRotationIntendedCharacters from "@/components/artifacts/rotations/AddEditRotationIntendedCharacters";
import AddEditRotationInfo from "@/components/artifacts/rotations/AddEditRotationInfo";
import AddEditRotationSubmit from "@/components/artifacts/rotations/AddEditRotationSubmit";
import AddEditRotationMenu from "@/components/artifacts/rotations/AddEditRotationMenu";


type Properties = {
    index: number
    data: ArtifactRotationData
    rotationsManager: ListManager<Rotation>
}

type States = {
    phase: AddEditRotationPhase
    // selectedDomain: string
    preparedRotation: Rotation
    addEdit: AddEdit
}

export default class AddEditRotation extends React.Component<Properties, States> {
    constructor(props: Readonly<Properties> | Properties) {
        super(props);

        this.state = {
            phase: AddEditRotationPhase.Prompt,
            preparedRotation: this.getBaseRotation(),
            addEdit: AddEdit.Add,
        }
    }

    getBaseRotation = (): Rotation => {
        return {
            domain: "",
            characters: [],
            note: "",
            days: this.props.data.rotations.fixedDays,
        }
    }

    addClicked = () => {
        this.setState({
            phase: AddEditRotationPhase.Domain,
            addEdit: AddEdit.Add,
            preparedRotation: this.getBaseRotation(),
        })
    }

    editClicked = () => {
        this.setState({
            phase: AddEditRotationPhase.Domain,
            addEdit: AddEdit.Edit,
            preparedRotation: {
                ...this.props.data.rotations.data[this.props.index],
            }
        })
    }

    setPhase = (phase: AddEditRotationPhase) => this.setState({phase: phase})

    cancelClicked = () => {
        this.setState({
            // selectedDomain: "",
            phase: AddEditRotationPhase.Prompt,
            preparedRotation: this.getBaseRotation(),
        })
    }

    deleteRotation = () => {
        this.props.rotationsManager.delete(this.props.index)
    }

    updatePreparedRotation = (rotation: Rotation) => {
        this.setState({preparedRotation: rotation})
    }

    moveRotation = (position: number) => {
        this.props.rotationsManager.move(this.props.index, position - 1)
    }

    render() {
        const addEditButtonsProperties: AddEditSharedProperties = {
            addEdit: this.state.addEdit,
            data: this.props.data,
            updatePreparedRotation: this.updatePreparedRotation,
            setPhase: this.setPhase,
            onCancel: this.cancelClicked,
            preparedRotation: this.state.preparedRotation,
            index: this.props.index == -1 ? this.props.data.rotations.data.length : this.props.index,
            manager: this.props.rotationsManager,
        }

        return (
            <Table.Row>
                <Table.Cell verticalAlign={'top'} colSpan={4} textAlign={'center'}>
                    {this.state.phase == AddEditRotationPhase.Prompt ? (
                        <AddEditRotationPrompt
                            data={this.props.data.rotations}
                            index={this.props.index}
                            onAddClicked={this.addClicked}
                            onEditClicked={this.editClicked}
                            onDeleteClicked={this.deleteRotation}
                            onMoveClicked={this.moveRotation}
                        />
                    ) : (
                        <>
                            <AddEditRotationMenu phase={this.state.phase} {...addEditButtonsProperties} />
                            {this.state.phase == AddEditRotationPhase.Domain &&
                                <AddEditRotationDomain {...addEditButtonsProperties}/>
                            }
                            {this.state.phase == AddEditRotationPhase.Characters &&
                                <AddEditRotationIntendedCharacters {...addEditButtonsProperties} />
                            }
                            {this.state.phase == AddEditRotationPhase.Info &&
                                <AddEditRotationInfo {...addEditButtonsProperties} />
                            }
                            <AddEditRotationSubmit {...addEditButtonsProperties}/>
                        </>
                    )}
                </Table.Cell>
            </Table.Row>
        )
    }
}

