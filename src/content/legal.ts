export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type LegalDocument = { title: string; eyebrow: string; intro: string; sections: LegalSection[] };

const review = 'Draft for review by qualified counsel before publication. Replace every bracketed placeholder.';

export const legalDocuments: Record<string, LegalDocument> = {
  privacy: {
    title: 'Privacy Policy', eyebrow: 'Privacy & data', intro: review,
    sections: [
      { heading: 'Who is responsible', paragraphs: ['VANGUARD is provided by [legal entity name], located at [business address] ("VANGUARD," "we," or "us"). Privacy questions can be sent to [privacy contact email]. This draft does not determine controller or processor roles for every use case.'] },
      { heading: 'Information we handle', paragraphs: ['Depending on how the service is configured and used, information may include account name and email, organization and workspace details, authentication records, settings, support communications, and technical information needed to operate and protect the service.', 'Users may submit commercial offer descriptions, company information, contact details, qualification criteria, and evidence. Do not submit sensitive personal information unless the service and your agreement expressly permit it.'] },
      { heading: 'How information is used', paragraphs: ['Information is used to provide requested workspace features, authenticate users, maintain organization access, respond to support requests, protect the service, and meet applicable legal obligations.', 'VANGUARD may use AI processing for product features when those features are enabled. The specific model provider, processing location, retention, and training terms must be disclosed in the applicable product configuration and customer agreement before those features are used with personal data.'] },
      { heading: 'Company and contact data', paragraphs: ['Business and contact data submitted by a customer is processed to provide the requested service. Customers are responsible for having a lawful basis, appropriate notices, and permissions for data they submit or use in outreach. Third-party company data sources are not specified in this document; applicable sources and terms must be disclosed before activation.'] },
      { heading: 'Sharing and service providers', paragraphs: ['We may share information with service providers needed to run a feature, under appropriate contractual terms. Resend may process recipient email addresses and message content when transactional authentication emails are sent. Other subprocessors are not identified in this draft and must be listed before production use. We do not sell personal information through the functionality described here.'] },
      { heading: 'Retention and deletion', paragraphs: ['Retention periods depend on account operation, customer instructions, legal requirements, and technical backups. The product does not yet publish fixed retention or deletion timelines. Contact [privacy contact email] to submit a request or ask about a customer-specific deletion process.'] },
      { heading: 'Security and transfers', paragraphs: ['Access controls and tenant protections are described on the Security page. Infrastructure provider controls, encryption configuration, incident history, and transfer mechanisms must be confirmed for the deployed environment. Do not treat this draft as a certification or compliance statement.'] },
      { heading: 'Privacy rights and updates', paragraphs: ['Depending on your location, you may have rights to request access, correction, deletion, restriction, objection, or portability. Send requests to [privacy contact email]. We may need to verify identity and coordinate with the customer that controls the relevant workspace data. We may update this policy; the current effective date will be shown above.'] },
    ],
  },
  terms: {
    title: 'Terms of Service', eyebrow: 'Terms', intro: review,
    sections: [
      { heading: 'Provider and acceptance', paragraphs: ['These terms are between you and [legal entity name], located at [business address]. They apply when you access VANGUARD. If you use the service for an organization, you confirm that you are authorized to accept these terms for it.'] },
      { heading: 'Accounts and workspaces', paragraphs: ['You must provide accurate account information, protect your credentials, and promptly report suspected unauthorized access. The organization that creates a workspace owns its workspace context. Workspace access is limited to authenticated members according to assigned roles.'] },
      { heading: 'Customer data and permitted use', paragraphs: ['You retain rights in information you submit and authorize us to process it only as needed to provide and protect the service and as otherwise agreed. You are responsible for the accuracy, permissions, notices, and lawful use of customer and contact data, including outreach.'] },
      { heading: 'Product output and human review', paragraphs: ['VANGUARD may organize evidence or generate analysis and draft outreach. Outputs can be incomplete, outdated, or incorrect and are not legal, financial, or professional advice. You must review supporting evidence and approve decisions and communications before acting.'] },
      { heading: 'Third-party services and availability', paragraphs: ['Some functionality may rely on third-party services or data sources whose terms also apply. Specific providers will be disclosed when configured. Features may change or be unavailable; no uptime or service-level commitment is made by this draft.'] },
      { heading: 'Acceptable use and enforcement', paragraphs: ['You must follow the Acceptable Use Policy, applicable laws, and third-party rights. We may restrict or suspend access where reasonably needed to address abuse, security risks, legal requirements, or material breach.'] },
      { heading: 'Fees, termination, and liability', paragraphs: ['No subscription or billing terms are established in this draft. Commercial terms must be set out in a separate order or agreement before paid service begins. Termination, liability limitations, dispute handling, and governing law require completion by counsel and are intentionally not invented here.'] },
      { heading: 'Contact and updates', paragraphs: ['Contact [legal contact email] about these terms. The terms may be updated with a revised effective date and notice appropriate to the change.'] },
    ],
  },
  cookies: {
    title: 'Cookie Policy', eyebrow: 'Privacy & data', intro: review,
    sections: [
      { heading: 'What cookies are used', paragraphs: ['The application uses authentication/session cookies required to maintain a signed-in session when authentication is enabled. Cookie names, attributes, and expiration are managed by Auth.js and deployment configuration and should be rechecked against the deployed environment before publication.', 'No analytics or advertising cookies are identified in the inspected application configuration. This policy should be updated if analytics, embedded media, or other optional storage is introduced.'] },
      { heading: 'Managing cookies', paragraphs: ['You can manage or remove cookies through your browser. Removing an authentication cookie may sign you out. Essential authentication cookies cannot be disabled while using signed-in areas. No optional-cookie consent mechanism is currently described.'] },
      { heading: 'Contact', paragraphs: ['Questions can be sent to [privacy contact email].'] },
    ],
  },
  'acceptable-use': {
    title: 'Acceptable Use Policy', eyebrow: 'Trust & responsible use', intro: review,
    sections: [
      { heading: 'Use the service lawfully', paragraphs: ['Use VANGUARD only for legitimate business purposes and in compliance with applicable law, third-party terms, and privacy rights. You are responsible for the data and instructions you provide.'] },
      { heading: 'Prohibited conduct', bullets: ['Attempting unauthorized access, credential theft, privilege escalation, or bypassing access controls.', 'Using the service for fraud, deception, harassment, unlawful discrimination, or abusive or unsolicited bulk outreach.', 'Scraping or collecting data without authorization, ignoring source terms, or misusing personal or confidential information.', 'Uploading malware, disrupting service, probing systems without authorization, or using generated information as verified fact without review.', 'Using VANGUARD to make consequential decisions about individuals without appropriate human review and legal safeguards.'] },
      { heading: 'Evidence and outreach', paragraphs: ['Verify evidence, respect opt-outs and suppression requirements, and review each recipient, message, and claim before outreach. Do not treat AI-generated content as proof of consent, accuracy, or legal compliance.'] },
      { heading: 'Enforcement and reporting', paragraphs: ['We may investigate reported misuse and restrict access where reasonably needed to protect users, data, or the service. Report suspected abuse to [security contact email].'] },
    ],
  },
  security: {
    title: 'Security', eyebrow: 'Trust & controls', intro: 'V1 is a public product prototype with illustrative data and no user accounts. The source-code controls below are V2 groundwork; they are not enabled or independently verified in a production deployment.',
    sections: [
      { heading: 'V2 source-code groundwork (not enabled in V1)', bullets: ['Auth.js credentials authentication with server-side password verification and scrypt password hashes.', 'JWT-based session handling with a 14-day configured maximum age; deployment cookie and secret configuration must be reviewed before use.', 'Organization memberships and roles are represented in PostgreSQL. Server-side tenant operations check membership and role inside a transaction.', 'Tenant-scoped PostgreSQL row-level security policies and transaction-local user and organization context are defined for tenant data tables.', 'One-time verification and reset tokens are stored as SHA-256 hashes and have expiry and consumed-state fields.', 'Transactional verification and reset email delivery can use Resend when server-only credentials and a verified sender are configured.'] },
      { heading: 'Deployment-dependent and unverified', bullets: ['Database role permissions, migration state, backups, network controls, and hosting infrastructure must be validated for each environment.', 'TLS, encryption at rest, log retention, monitoring, incident response contacts, and recovery objectives depend on deployment configuration and are not claimed here.', 'The repository does not establish SOC 2 or ISO 27001 certification, penetration testing, independent audit, uptime commitments, or legal compliance certification.'] },
      { heading: 'Responsible handling', paragraphs: ['Access should be limited to authorized organization members. Do not submit sensitive data unless its use is covered by a customer agreement and enabled product feature. Contact [security contact email] to report a suspected security issue.'] },
    ],
  },
  dpa: {
    title: 'Data Processing Agreement', eyebrow: 'Data protection', intro: 'Draft structure only. This document is not legally finalized and is not automatically suitable for any jurisdiction. Complete with counsel and execute with the applicable customer agreement before processing personal data as a processor.',
    sections: [
      { heading: '1. Parties and definitions', paragraphs: ['This agreement is between [customer legal entity and address] (Controller) and [VANGUARD legal entity and address] (Processor), effective [effective date]. Terms such as Personal Data, Processing, Data Subject, Controller, and Processor have the meanings given in applicable data protection law.'] },
      { heading: '2. Scope and instructions', paragraphs: ['Processor processes Personal Data only to provide [services in the order form], following documented Controller instructions, this agreement, and applicable law. Processing details are set out in Annex 1.'] },
      { heading: '3. Responsibilities and confidentiality', paragraphs: ['Controller determines purposes and means and is responsible for notices, lawful basis, data accuracy, and instructions. Processor ensures authorized personnel are subject to confidentiality obligations and processes data only as instructed, except where law requires otherwise.'] },
      { heading: '4. Security measures', paragraphs: ['Processor will maintain measures appropriate to the agreed service and risk. The parties must complete Annex 2 with verified technical and organizational measures before execution. No unverified certification or control is incorporated by reference.'] },
      { heading: '5. Subprocessors', paragraphs: ['Controller authorizes only the subprocessors listed in Annex 3. Processor will provide notice of proposed changes and a reasonable opportunity to object under the agreed procedure. No subprocessor list has been verified for this draft.'] },
      { heading: '6. Data subject requests and incidents', paragraphs: ['Processor will provide reasonable assistance with data subject requests and notify Controller without undue delay after becoming aware of a Personal Data Breach affecting the processed data. The parties must specify the notice channel and operational timelines.'] },
      { heading: '7. Transfers, retention, and deletion', paragraphs: ['International transfers require a valid transfer mechanism and any required supplementary measures documented by the parties. At the end of services, Processor will [return or delete] Personal Data subject to documented retention obligations and backup limitations. Specific retention periods are not established here.'] },
      { heading: '8. Audit and termination', paragraphs: ['Processor will make information reasonably necessary to demonstrate compliance available and support proportionate audits under agreed confidentiality, scope, notice, and cost terms. Termination follows the applicable services agreement.'] },
      { heading: 'Annex 1 — Processing details', bullets: ['Subject matter and duration: [complete].', 'Nature and purpose: [complete].', 'Types of Personal Data and Data Subjects: [complete].', 'Controller rights and obligations: [complete].'] },
      { heading: 'Annex 2 — Technical and organizational measures', bullets: ['Authentication and access control: describe verified production configuration.', 'Tenant separation and authorization: describe deployed database policies and tested transaction context.', 'Encryption, backups, availability, incident response, and deletion: complete from verified operational records.'] },
      { heading: 'Annex 3 — Subprocessors and transfer locations', paragraphs: ['List each approved subprocessor, processing purpose, location, and transfer mechanism here. Resend may process transactional email recipient addresses and content if enabled; confirm the applicable contract and processing location before listing it as an approved subprocessor.'] },
    ],
  },
};

export const legalLinks = [
  ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookie Policy', '/cookies'],
  ['Acceptable Use', '/acceptable-use'], ['Security', '/security'], ['DPA', '/dpa'],
] as const;

export const legalReviewNotice = review;
