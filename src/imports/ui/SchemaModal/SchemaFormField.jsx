import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Select from 'react-select';
import { MultiSelectTextInput } from './MultiSelectTextInput';

const typeOptions = [
  {value: "number", label: "Number"},
  {value: "string", label: "String"}
]

const createOption = (label) => ({
  label,
  value: label,
});

export const SchemaFormField = ( { className, index, field, handleFieldChange} ) => {
  const [allowedInputText, setAllowedInputText] = useState("");
  
  const handleNameChange = (event) => {
    newField = field;
    newField.name = event.currentTarget.value;
    handleFieldChange(newField, index);
  }

  const handleTypeChange = (value, actionMeta) => {
    newField = field;
    newField.type = value;
    handleFieldChange(newField, index);
  }

  const handleAllowedChange = (value, actionMeta) => {
    newField = field;
    newField.allowed = value;
    handleFieldChange(newField, index);
  }

  const handleInputChange = (allowedInputText) => {
    setAllowedInputText(allowedInputText);
  }

  const handleKeyDown = (event) => {
    if (!allowedInputText) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        newField = field;
        newField.allowed = [...field.allowed, createOption(allowedInputText)];
        setallowedInputText("");
        event.preventDefault();
    }
  }
  
  return (
    <div className={className}>
      <Form.Row>
        <Col>
          <Form.Control onChange={handleNameChange} value={field.name} placeholder="Field" />
        </Col>
        <Col>
          <Select 
            options={typeOptions}
            value={field.type}
            handleChange={handleTypeChange}
            placeholder="Data type"
          />
        </Col>
      </Form.Row>
      <Form.Row className="pt-2">
        <Col>
          <MultiSelectTextInput 
            inputText={allowedInputText} 
            value={field.allowed}
            handleChange={handleAllowedChange}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
          />
        </Col>
      </Form.Row>
    </div>
  )
};
