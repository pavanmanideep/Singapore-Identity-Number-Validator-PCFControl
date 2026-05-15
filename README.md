![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Power%20Platform-blue)
![Type](https://img.shields.io/badge/Type-PCF%20Control-purple)
![Release](https://img.shields.io/badge/Release-v1.0.0-orange)
![Visitors](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/pavanmanideep/Singapore-Identity-Number-Validator-PCFControl)

# Singapore NRIC/FIN Validator - PCF Control

A PowerApps Component Framework (PCF) control for validating Singapore NRIC/FIN (National Registration Identity Card) and FIN (Foreign Identification Number) numbers.

## Features

- ✅ Real-time validation of Singapore NRIC/FIN numbers
- ✅ Format validation (prefix, digits, checksum letter)
- ✅ Checksum algorithm verification
- ✅ Auto-formatting (converts to uppercase, removes invalid characters)
- ✅ Visual feedback with color-coded validation messages
- ✅ Supports all NRIC/FIN types: S, T, F, G, M prefixes
- ✅ Read-only mode support
- ✅ 9-character maximum length enforcement

## What is NRIC/FIN?

Singapore NRIC/FIN numbers are unique identification numbers issued to:
- **S prefix**: Singapore Citizens (born before 2000)
- **T prefix**: Singapore Citizens (born from 2000 onwards) and Permanent Residents
- **F prefix**: Foreigners (issued before 2000)
- **G prefix**: Foreigners (issued from 2000 onwards)
- **M prefix**: Foreigners (issued from 2022 onwards)

Format: `[Prefix][7 digits][Checksum Letter]` (e.g., S1234567D)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [.NET Framework 4.6.2 Developer Pack](https://dotnet.microsoft.com/download/dotnet-framework) or later
- [Power Platform CLI](https://aka.ms/PowerAppsCLI)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Installation

o	Download solution
o	Go to your Dynamics 365 CRM environment.
o	Navigate to Settings > Solutions.
o	Click Import and select the generated zip file.
o	Follow the prompts to complete the import process.

### Project Structure

```
SingaporeNricValidator/
├── SingaporeNricValidator/     # PCF component source
│   ├── index.ts                # Main component logic
│   ├── ControlManifest.Input.xml  # Component manifest
│   └── generated/              # Auto-generated type definitions
├── EcellorsSingaporeNRICSolution/  # Solution wrapper for deployment
├── package.json                # NPM dependencies
├── tsconfig.json               # TypeScript configuration
└── eslint.config.mjs           # ESLint configuration
```

## Usage in Power Apps

### Making customizations to this control

1. **Clone the Repo**

  git clone **https://github.com/pavanmanideep/Singapore-Identity-Number-Validator-PCFControl.git**
   
2. **Build the solution**
   ```bash
   npm run build
   ```

3. **Create a solution package** (using Power Platform CLI)
   ```bash
   pac solution init --publisher-name YourPublisher --publisher-prefix prefix
   pac solution add-reference --path ./
   msbuild /t:build /restore
   ```

4. **Import to Power Apps**
   - Navigate to [Power Apps](https://make.powerapps.com)
   - Go to Solutions
   - Import the managed solution package available for this control
   - Open any entity form
     <img width="800" height="332" alt="image" src="https://github.com/user-attachments/assets/040e6bca-8ae5-4b72-a6da-b44db8ef8a94" />
     Next
     <img width="959" height="214" alt="image" src="https://github.com/user-attachments/assets/208fcaf7-2dc8-4584-b75b-1bc2ce551a38" />
     Create a single line text column, let's say we create Singapore NRIC/FIN 
     <img width="959" height="410" alt="image" src="https://github.com/user-attachments/assets/cf55c19b-803d-48cf-be4a-f0bb83839472" />
     Bind this field to control, by attaching it to a component
     <img width="721" height="305" alt="image" src="https://github.com/user-attachments/assets/796495a9-05be-4ac2-b323-2437f489423b" />   

      <img width="686" height="267" alt="image" src="https://github.com/user-attachments/assets/4f24fa72-57fd-4925-b1f8-09a0682103ea" />

### Validation Messages

- **Valid NRIC/FIN**: Green message "Valid NRIC/FIN."
- **Invalid Format**: Red message "Please enter a valid Singapore NRIC Number"
- **Empty Field**: Gray message "Enter NRIC/FIN."

## How the Validation Works

The control implements the official Singapore NRIC/FIN checksum algorithm:

1. **Format Check**: Verifies the format matches `[STFGM][7 digits][Letter]`
2. **Checksum Calculation**:
   - Multiply each digit by weights: [2, 7, 6, 5, 4, 3, 2]
   - Add offset based on prefix (T/G: +4, M: +3)
   - Calculate remainder when divided by 11
   - Compare with expected checksum letter

3. **Checksum Letter Sequences**:
   - S/T (Citizens): J, Z, I, H, G, F, E, D, C, B, A
   - F/G/M (Foreigners): X, W, U, T, R, Q, P, N, M, L, K

## Testing

Try these sample valid NRIC numbers in the test harness:

- S1234567D
- T1234567J
- F1234567N
- G1234567X
  
Model Driven Apps
  <img width="959" height="302" alt="image" src="https://github.com/user-attachments/assets/ad3623d0-2d5b-47c7-b337-29783db81f94" />

  <img width="948" height="233" alt="image" src="https://github.com/user-attachments/assets/0519e620-02e8-4676-aa57-556f0b270175" />

  If you were interested in using this control, there is a managed solution in the Repo, you can install this solution in your environment, clone this repo, built control at your convenience following 

  https://ecellorscrm.com/2023/02/23/run-pcf-code-components-in-browser-quick-recap/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the official Singapore NRIC/FIN validation algorithm
- Built with PowerApps Component Framework (PCF)
- Developed for use in Microsoft Power Apps model-driven applications
- Wikipedia page: https://en.wikipedia.org/wiki/National_Registration_Identity_Card

## Support

For issues, questions, or contributions, please use the GitHub issue tracker.

---

**Note**: This control validates the format and checksum of NRIC/FIN numbers but does not verify if the number is actually issued by the Singapore government. Always verify identity documents through official channels. Once the managed solution is imported to the target Power Platform Environment, you may loose the capability to delete the control, so please use at caution.
