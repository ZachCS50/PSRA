import React, { useState, useEffect } from "react";
// Imports
import { Field } from "formik";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

// @material-ui
import {
  Grid,
  makeStyles,
  Paper,
  IconButton,
  TextField,
  FormControl,
  MenuItem,
  InputAdornment,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import LinkIcon from "@material-ui/icons/Link";

const useStyles = makeStyles((theme) => ({
  entryPaper: {
    padding: "15px",
  },
  allFields: {
    paddingRight: "10px",
  },
  fieldContainer: {
    marginBottom: "10px",
    resize: "both",
  },
  field: {
    marginBottom: 4,
    resize: "both",
  },
  inputAdornment: {
    cursor: "pointer",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  helpersError: {
    marginLeft: 14,
    color: theme.palette.error.main,
  },
  helpers: {
    marginLeft: 14,
    color: theme.palette.text.disabled,
  },
  lastBuffer: {
    marginTop: -10,
  },
}));

export const DashboardEntry = ({
  entryIndex,
  schema,
  entry,
  setFieldValue,
  editing,
  errors,
  entries,
  setSatSchema,
  isUniqueList,
  schemas,
  satelliteValidatorShaper,
  setTouched,
  values,
}) => {
  const classes = useStyles();

  const [helpers, setHelpers] = useState(null);
  const [charCount, setCharCount] = useState(null);

  const debounced = useDebouncedCallback((event) => {
    let obj = {};
    obj[`${event.target.name}`] = true;
    setTouched(obj);
    setFieldValue(event.target.name, event.target.value);
  }, 500);

  const preliminaryDebounced = useDebouncedCallback((event) => {
    // Needed in order for errors to be properly set or cleared after Formik completes a check on the satellite data
    setFieldValue(event.target.name, event.target.value);
  }, 300);

  const refreshHelpers = () => {
    if (JSON.stringify(errors) !== "{}") {
      setHelpers(Object.keys(errors));
    } else {
      setHelpers(null);
    }
  };

  useEffect(() => {
    refreshHelpers();
  }, [errors]);

  const filteredHelper = (name, entryIndex, fieldIndex) => {
    let helper = null;
    if (helpers?.includes(`${name}-${entryIndex}-${fieldIndex}`)) {
      return errors
        ? (helper = errors[`${name}-${entryIndex}-${fieldIndex}`])
        : null;
    }
    return helper;
  };

  const helper = (field) => {
    let helper = null;
    if (field.min || field.max) {
      if (field.min && field.max)
        helper = `Minimum Value: ${field.min}, Maximum Value: ${field.max}`;
      if (field.min && !field.max)
        helper = `Minimum Value: ${field.min}, Maximum Value: N/A`;
      if (!field.min && field.max)
        helper = `Minimum Value: N/A, Maximum Value: ${field.max}`;
    }
    if (field.stringMax) {
      helper = `${charCount || entry[field.name]?.length} / ${field.stringMax}`;
    }
    if (field.allowedValues?.length > 0) {
      if (field.allowedValues?.length === 2) {
        helper = `Allowed Values: ${field.allowedValues.join(" or ")}`;
      } else {
        helper = `Allowed Values: ${field.allowedValues.join(", ")}`;
      }
    }
    return helper;
  };

  const handleEntryDelete = async (schemaName, index) => {
    let newEntries = entries.map((entry) => entry);
    newEntries.splice(index, 1);
    await setFieldValue(schemaName, newEntries);
    setSatSchema(satelliteValidatorShaper(schemas, values, isUniqueList)); // generate new validation schema based on added entry
  };

  const handleClick = (url) => {
    window.open(url, "_blank").focus();
  };

  const charCounter = (event) => {
    if (typeof event.target.value === "string")
      setCharCount(event.target.value.length);
  };

  const fieldProps = (classes, field, fieldIndex) => {
    return {
      className: classes.field,
      inputProps: {
        name: `${schema.name}.${entryIndex}.${field.name}`,
        min: field.min,
        max: field.max,
        maxLength: field.stringMax,
        step: "any",
        spellCheck: true,
        autoComplete: "off",
      },
      InputLabelProps: {
        shrink: true,
      },
      defaultValue: entry[`${field.name}`]
        ? entry[`${field.name}`]
        : field.allowedValues?.length > 0
        ? field.allowedValues[0]
        : "",
      onChange: (event) => {
        charCounter(event);
        preliminaryDebounced(event);
        debounced(event);
      },
      error: filteredHelper(schema.name, entryIndex, fieldIndex) ? true : false,
      label: field.name,
      margin: "dense",
      required: field.required,
      fullWidth: true,
      variant: "outlined",
      multiline: field.stringMax > 255,
      rows:
        (!field.stringMax && field.type !== "url") || field.stringMax > 255
          ? 5
          : 1,
      component: editing
        ? TextField
        : (props) => linkAdornment(props, entry[`${field.name}`], field.type),

      type: field.type === "date" ? "datetime-local" : field.type,
      disabled: !editing,
      autoComplete: "off",
    };
  };

  const linkAdornment = (props, field, type) => {
    return (
      <TextField
        InputProps={
          type === "url"
            ? {
                endAdornment: (
                  <Tooltip
                    title={"Open URL in a new tab"}
                    arrow
                    placement="top-end"
                  >
                    <InputAdornment
                      className={classes.inputAdornment}
                      position="end"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(field);
                      }}
                    >
                      <LinkIcon />
                    </InputAdornment>
                  </Tooltip>
                ),
              }
            : null
        }
        {...props}
      />
    );
  };

  return (
    <Grid item xs={12}>
      <Paper className={classes.entryPaper}>
        <Grid container spacing={0}>
          <Grid item xs={editing ? 11 : 12} className={classes.allFields}>
            {schema.fields.map((field, fieldIndex) => {
              return (
                <div key={fieldIndex} className={classes.fieldContainer}>
                  {field.allowedValues?.length === 0 ? (
                    <Field {...fieldProps(classes, field, fieldIndex)} />
                  ) : (
                    <FormControl
                      className={classes.field}
                      disabled={!editing}
                      variant="outlined"
                      margin="dense"
                      required
                      fullWidth
                      error={
                        filteredHelper(schema.name, entryIndex, fieldIndex)
                          ? true
                          : false
                      }
                    >
                      <Field {...fieldProps(classes, field, fieldIndex)} select>
                        <MenuItem value="" disabled>
                          <em>Allowed Values</em>
                        </MenuItem>
                        {field.allowedValues.map((value, valueIndex) => {
                          return (
                            <MenuItem key={valueIndex} value={value}>
                              {value}
                            </MenuItem>
                          );
                        })}
                      </Field>
                    </FormControl>
                  )}
                  {filteredHelper(schema.name, entryIndex, fieldIndex) ? (
                    <Typography
                      variant="caption"
                      className={classes.helpersError}
                    >
                      {filteredHelper(schema.name, entryIndex, fieldIndex)}
                    </Typography>
                  ) : editing ? (
                    <Typography variant="caption" className={classes.helpers}>
                      {helper(field)}
                    </Typography>
                  ) : null}
                </div>
              );
            })}
            <div className={classes.lastBuffer} />
          </Grid>
          {editing && (
            <Grid container item xs={editing ? 1 : 0} alignContent="center">
              <IconButton
                aria-label="delete field"
                color="default"
                onClick={() => handleEntryDelete(schema.name, entryIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};