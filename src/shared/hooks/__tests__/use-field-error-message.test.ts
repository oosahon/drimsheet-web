import { describe, it, expect } from "vitest";
import useFieldErrorMessage from "../use-field-error-message";

interface FormValues {
  firstName: string;
  lastName: string;
}

describe("useFieldErrorMessage", () => {
  it("should return an empty array if the field is not touched", () => {
    const errors = { firstName: "First Name is required" };
    const touched = { firstName: false };
    
    const getErrorMessage = useFieldErrorMessage<FormValues>({ 
      errors: errors as any, 
      touched: touched as any 
    });
    
    expect(getErrorMessage("firstName")).toEqual([]);
  });

  it("should return an empty array if the field is touched but has no error", () => {
    const errors = {};
    const touched = { firstName: true };
    
    const getErrorMessage = useFieldErrorMessage<FormValues>({ 
      errors, 
      touched: touched as any 
    });
    
    expect(getErrorMessage("firstName")).toEqual([]);
  });

  it("should return an array with a message object when the field is touched and has an error", () => {
    const errors = { firstName: "First Name is required" };
    const touched = { firstName: true };
    
    const getErrorMessage = useFieldErrorMessage<FormValues>({ 
      errors: errors as any, 
      touched: touched as any 
    });
    
    expect(getErrorMessage("firstName")).toEqual([{ message: "First Name is required" }]);
  });

  it("should handle multiple fields independently", () => {
    const errors = { firstName: "Required", lastName: "Too short" };
    const touched = { firstName: true, lastName: false };
    
    const getErrorMessage = useFieldErrorMessage<FormValues>({ 
      errors: errors as any, 
      touched: touched as any 
    });
    
    expect(getErrorMessage("firstName")).toEqual([{ message: "Required" }]);
    expect(getErrorMessage("lastName")).toEqual([]);
  });
});
