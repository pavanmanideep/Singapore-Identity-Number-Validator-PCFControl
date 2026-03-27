import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SingaporeNricFinValidatorControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private inputElement: HTMLInputElement;
    private messageElement: HTMLDivElement;
    private currentValue: string;

    constructor() {
        this.notifyOutputChanged = () => {
            return;
        };
        this.currentValue = "";
        this.inputElement = document.createElement("input");
        this.messageElement = document.createElement("div");
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.currentValue = this.normalizeInput(context.parameters.nricValue.raw);

        this.inputElement = document.createElement("input");
        this.inputElement.type = "text";
        this.inputElement.placeholder = "e.g. S1234567D";
        this.inputElement.maxLength = 9;
        this.inputElement.value = this.currentValue;
        this.inputElement.style.width = "100%";
        this.inputElement.style.boxSizing = "border-box";
        this.inputElement.style.padding = "8px";

        this.messageElement = document.createElement("div");
        this.messageElement.style.marginTop = "6px";
        this.messageElement.style.fontSize = "12px";

        this.inputElement.addEventListener("input", this.handleInputChange);

        container.appendChild(this.inputElement);
        container.appendChild(this.messageElement);

        this.renderValidationMessage();
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const latestValue = this.normalizeInput(context.parameters.nricValue.raw);
        if (latestValue !== this.currentValue) {
            this.currentValue = latestValue;
            this.inputElement.value = latestValue;
        }

        this.renderValidationMessage();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            nricValue: this.currentValue
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        this.inputElement.removeEventListener("input", this.handleInputChange);
    }

    private readonly handleInputChange = (): void => {
        const normalized = this.normalizeInput(this.inputElement.value);
        if (this.inputElement.value !== normalized) {
            this.inputElement.value = normalized;
        }

        this.currentValue = normalized;
        this.renderValidationMessage();
        this.notifyOutputChanged();
    };

    private normalizeInput(value: string | null | undefined): string {
        return (value ?? "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 9);
    }

    private renderValidationMessage(): void {
        const validation = this.validateNric(this.currentValue);
        this.messageElement.textContent = validation.message;
        this.messageElement.style.color = validation.isValid ? "#107C10" : "#A4262C";
    }

    private validateNric(value: string): { isValid: boolean; message: string } {
        if (!value) {
            return { isValid: false, message: "Enter NRIC/FIN." };
        }

        const normalized = value.toUpperCase();
        const formatRegex = /^[STFGM]\d{7}[A-Z]$/;
        if (!formatRegex.test(normalized)) {
            return { isValid: false, message: "Please enter a valid Singapore NRIC/FIN Number" };
        }

        const prefix = normalized.charAt(0);
        const digits = normalized
            .substring(1, 8)
            .split("")
            .map((digit) => parseInt(digit, 10));

        const weights = [2, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        for (let index = 0; index < weights.length; index++) {
            sum += digits[index] * weights[index];
        }

        if (prefix === "T" || prefix === "G") {
            sum += 4;
        }

        if (prefix === "M") {
            sum += 3;
        }

        const remainder = sum % 11;
        const citizenSequence = "JZIHGFEDCBA";
        const foreignSequence = "XWUTRQPNMLK";
        const expectedChecksum = (prefix === "S" || prefix === "T")
            ? citizenSequence.charAt(remainder)
            : foreignSequence.charAt(remainder);

        const actualChecksum = normalized.charAt(8);
        if (actualChecksum !== expectedChecksum) {
            return { isValid: false, message: "Please enter a valid Singapore NRIC/FIN Number" };
        }

        return { isValid: true, message: "Valid NRIC/FIN Number" };
    }
}
