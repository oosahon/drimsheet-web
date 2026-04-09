import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Field, FieldDescription, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AccountingEntityRadioGroup } from "./accounting-entity-radio-group";

export function OnboardingDialog() {
  return (
    <Dialog open>
      <form>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Account Setup</DialogTitle>
            <DialogDescription className="text-sm">
              Choose the type of account you want to create.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <FieldDescription className="text-xs">
                This is the name that will be displayed on your profile.
              </FieldDescription>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
          </FieldGroup>
          <AccountingEntityRadioGroup />
          <DialogFooter>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
