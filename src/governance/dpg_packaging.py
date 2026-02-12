import os

def create_license():
    """Create Apache 2.0 license file for Digital Public Good compliance."""
    license_text = """Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction,
and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity granting the License.

"Legal Entity" shall mean the union of the acting entity and all
other entities that control, are controlled by, or are under common
control with that entity. For the purposes of this definition,
"control" means (i) the power, direct or indirect, to cause the
direction or management of such entity, whether by contract or
otherwise, or (ii) ownership of fifty percent (50%) or more of the
outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity
exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications,
including but not limited to software source code, documentation
source, and configuration files.

"Object" form shall mean any form resulting from mechanical
transformation or translation of a Source form, including but
not limited to compiled object code, generated documentation,
and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or
Object form, made available under the terms of this License, as
indicated by a copyright notice that is included in or attached to
the work.

"Derivative Works" shall mean any work, whether in Source or Object
form, that is based upon (or derived from) the Work and for which the
editorial revisions, annotations, elaborations, or other modifications
represent, as a whole, an original work of authorship.

"Contribution" shall mean any work of authorship, including the original
version of the Work and any modifications or additions to that Work or
Derivative Works, that is intentionally submitted to Licensor for
inclusion in the Work by the copyright owner or by an individual or
Legal Entity authorized to submit on behalf of the copyright owner.

"Contributor" shall mean Licensor and any individual or Legal Entity
on behalf of whom a Contribution has been received by Licensor and
subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of
this License, each Contributor hereby grants to You a perpetual,
worldwide, non-exclusive, no-charge, royalty-free, irrevocable
copyright license to use, reproduce, prepare Derivative Works of,
publicly display, publicly perform, sublicense, and distribute the
Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of
this License, each Contributor hereby grants to You a perpetual,
worldwide, non-exclusive, no-charge, royalty-free, irrevocable
(except as stated in this section) patent license to make, have made,
use, offer to sell, sell, import, and otherwise transfer the Work,
where such license applies only to those patent claims licensable
by such Contributor that are necessarily infringed by their
Contribution(s) alone or by combination of their Contribution(s)
with the Work to which such Contribution(s) was submitted. If You
institute patent litigation against any entity (including a
cross-claim or counterclaim in a lawsuit) alleging that the Work
or a Contribution incorporated within the Work constitutes direct
or contributory patent infringement, then any patent licenses
granted to You under this License for that Work shall terminate
as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the
Work or Derivative Works in any medium, with or without
modifications, in Source or Object form, provided that You
meet the following conditions:

(a) You must give any other recipients of the Work or
Derivative Works a copy of this License; and

(b) You must cause any modified files to carry prominent notices
stating that You changed the files; and

(c) You must retain, in the Source form of any Derivative Works
that You distribute, all copyright, trademark, patent,
attribution and other notices from the Source form of the Work,
excluding those notices that do not pertain to any part of
the Derivative Works; and

(d) If the Work includes a "NOTICE" file as part of its
distribution, then any Derivative Works that You distribute must
include a readable copy of the attribution notices contained
within such NOTICE file, excluding those notices that do not
pertain to any part of the Derivative Works.

5. Submission of Contributions. Unless You explicitly state otherwise,
any Contribution intentionally submitted for inclusion in the Work
by You to the Licensor shall be under the terms and conditions of
this License, without any additional terms or conditions.
Notwithstanding the above, nothing herein shall supersede or modify
the terms of any separate license agreement you may have executed
with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade
names, trademarks, service marks, or product names of the Licensor,
except as required for reasonable and customary use in describing the
origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or
agreed to in writing, Licensor provides the Work (and each
Contributor provides its Contributions) on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied, including, without limitation, any warranties or conditions
of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
PARTICULAR PURPOSE. You are solely responsible for determining the
appropriateness of using or redistributing the Work and assume any
risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory,
whether in tort (including negligence), contract, or otherwise,
unless required by applicable law (such as deliberate and grossly
negligent acts) or agreed to in writing, shall any Contributor be
liable to You for damages, including any direct, indirect, special,
incidental, or consequential damages of any character arising as a
result of this exercise of permissions under this License or out of
the use or inability to use the Work (including but not limited to
damages for loss of goodwill, work stoppage, computer failure or
malfunction, or any and all other commercial damages or losses), even
if such Contributor has been advised of the possibility of such damages.

9. Accepting Support, Warranty or Additional Liability. While redistributing
the Work or Derivative Works, You may choose to offer, and charge a
fee for, acceptance of support, warranty, indemnity, or other
liability obligations and/or rights consistent with this
License. However, in accepting such obligations, You may act only
on Your own behalf and on Your sole responsibility, not on behalf
of any other Contributor, and only if You agree to indemnify,
defend, and hold each Contributor harmless for any liability
incurred by, or claims asserted against, such Contributor by reason
of your accepting any such warranty or indemnity.

END OF TERMS AND CONDITIONS"""
    
    with open('LICENSE', 'w') as f:
        f.write(license_text)

def create_dpg_metadata():
    """Create Digital Public Good metadata file."""
    metadata = """# Digital Public Good Metadata

## Name
Kenya Childhood Malnutrition Risk Prediction

## Description
An open-source machine learning system for predicting acute childhood malnutrition risk at sub-county level in Kenya, incorporating WHO Data Quality Review standards and automated governance features.

## Public Purpose
This Digital Public Good supports UNICEF, USAID, and government health ministries in preventing childhood malnutrition through data-driven decision-making. It enables early warning systems for humanitarian response and resource allocation optimization.

## Non-Harm Statement
This system is designed exclusively for programmatic decision support in malnutrition prevention. It does not provide clinical diagnoses, medical advice, or individual health assessments. All outputs include clear disclaimers about appropriate use.

## Open Governance
Developed under open-source principles with contributions from UN agencies, NGOs, and government partners. Governance follows Digital Public Good Alliance standards with transparent development and ethical safeguards.

## Key Features
- Machine learning predictions for malnutrition risk
- WHO DQR-compliant data quality monitoring
- Automated PDF reporting
- Quality-weighted model training
- Stakeholder alert systems

## Target Users
- County Health Records & Information Officers (CHRIOs)
- NGO M&E Officers
- UNICEF/USAID analysts
- Government health planners

## License
Apache License 2.0

## Contact
For reuse inquiries: dpg@malnutrition-project.org
"""
    
    with open('DPG_METADATA.md', 'w') as f:
        f.write(metadata)

def create_contributing():
    """Create contributing guidelines."""
    contributing = """# Contributing to Kenya Malnutrition Risk Prediction

Thank you for your interest in contributing to this Digital Public Good!

## Development Principles
- **Ethical AI**: All contributions must prioritize ethical use and avoid harm
- **Open Access**: Maintain open-source compatibility and public availability
- **Quality Assurance**: Include tests and documentation for all changes
- **Transparency**: Document decisions and limitations clearly

## How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Add tests and documentation
5. Submit a pull request

## Code Standards
- Follow PEP 8 Python style guidelines
- Include docstrings for all public functions
- Add type hints where appropriate
- Ensure cross-platform compatibility

## Testing
- Run all existing tests before submitting
- Add new tests for new functionality
- Test on multiple Python versions (3.10+)

## Documentation
- Update README for any user-facing changes
- Document API changes clearly
- Include NGO-relevant context in docstrings

## Ethical Guidelines
- Never include proprietary data or credentials
- Ensure outputs include appropriate disclaimers
- Consider privacy and data protection implications
- Maintain focus on humanitarian benefit

## Governance
This project follows Digital Public Good Alliance standards. Major changes should be discussed with UN/NGO partners before implementation.

## Questions?
Contact the maintainers at: contributors@malnutrition-project.org
"""
    
    with open('CONTRIBUTING.md', 'w') as f:
        f.write(contributing)

def create_code_of_conduct():
    """Create code of conduct for the project."""
    coc = """# Code of Conduct

## Our Pledge
We as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.

## Our Standards
Examples of behavior that contributes to a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior:
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Enforcement Responsibilities
Community leaders are responsible for clarifying and enforcing standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

## Scope
This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces.

## Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders at conduct@malnutrition-project.org.

## Attribution
This Code of Conduct is adapted from the Contributor Covenant, version 2.1.
"""
    
    with open('CODE_OF_CONDUCT.md', 'w') as f:
        f.write(coc)

def package_for_dpg():
    """
    Generate all Digital Public Good compliance files.
    
    Creates standardized documentation and licensing to meet Digital Public Good
    Alliance requirements for open-source humanitarian technology.
    """
    create_license()
    create_dpg_metadata()
    create_contributing()
    create_code_of_conduct()
    
    print("Digital Public Good packaging complete:")
    print("- LICENSE (Apache 2.0)")
    print("- DPG_METADATA.md")
    print("- CONTRIBUTING.md")
    print("- CODE_OF_CONDUCT.md")

if __name__ == "__main__":
    package_for_dpg()