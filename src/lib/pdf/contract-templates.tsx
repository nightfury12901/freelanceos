import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1e293b",
  },
  header: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 24,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Helvetica",
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 120,
    fontWeight: 600,
  },
  value: {
    flex: 1,
  },
  signatureBlock: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    paddingTop: 8,
  },
  date: {
    marginTop: 8,
    color: "#64748b",
  }
});

type TemplateType = "nda" | "sow" | "retainer" | string;

export interface ContractProps {
  type: TemplateType;
  freelancerName: string;
  clientName: string;
  effectiveDate: string;
  // Dynamic fields
  governingLaw?: string;
  projectScope?: string;
  compensation?: string;
  duration?: string;
}

export function ContractPDFTemplate(props: ContractProps) {
  const {
    type,
    freelancerName,
    clientName,
    effectiveDate,
    governingLaw = "India",
    projectScope = "Services as agreed between the parties.",
    compensation = "As per separate invoice/agreement.",
    duration = "Ongoing until terminated.",
  } = props;

  const dateStr = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(effectiveDate));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* NDA TEMPLATE */}
        {type === "nda" && (
          <View>
            <Text style={styles.header}>Non-Disclosure Agreement</Text>
            
            <Text style={styles.paragraph}>
              This Non-Disclosure Agreement (the &quot;Agreement&quot;) is entered into on {dateStr} (the &quot;Effective Date&quot;), by and between:
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Receiving Party:</Text>
              <Text style={styles.value}>{freelancerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Disclosing Party:</Text>
              <Text style={styles.value}>{clientName}</Text>
            </View>

            <Text style={styles.sectionTitle}>1. Definition of Confidential Information</Text>
            <Text style={styles.paragraph}>
              &quot;Confidential Information&quot; means all non-public, confidential or proprietary information disclosed before, on, or after the Effective Date, by the Disclosing Party to the Receiving Party or its affiliates, or to any of such Receiving Party&apos;s or its affiliates&apos; employees, officers, directors, partners, or agents (collectively, &quot;Representatives&quot;), whether disclosed orally or disclosed or accessed in written, electronic or other form or media, and whether or not marked, designated or otherwise identified as &quot;confidential&quot;.
            </Text>

            <Text style={styles.sectionTitle}>2. Obligations</Text>
            <Text style={styles.paragraph}>
              The Receiving Party shall maintain the Confidential Information in strict confidence and shall not disclose, copy, or distribute such Confidential Information to any third party without the prior written consent of the Disclosing Party. The Receiving Party shall use the Confidential Information solely for the purpose of evaluating or pursuing a business relationship with the Disclosing Party.
            </Text>

            <Text style={styles.sectionTitle}>3. Governing Law</Text>
            <Text style={styles.paragraph}>
              This Agreement shall be governed by and construed in accordance with the laws of {governingLaw}, without regard to its conflict of law principles.
            </Text>
          </View>
        )}

        {/* SOW TEMPLATE */}
        {type === "sow" && (
          <View>
            <Text style={styles.header}>Statement of Work (SOW)</Text>
            
            <Text style={styles.paragraph}>
              This Statement of Work is effective {dateStr} (the &quot;Effective Date&quot;), under the terms of the Master Services Agreement or general independent contractor terms between the parties below:
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Service Provider:</Text>
              <Text style={styles.value}>{freelancerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Client:</Text>
              <Text style={styles.value}>{clientName}</Text>
            </View>

            <Text style={styles.sectionTitle}>1. Project Scope & Deliverables</Text>
            <Text style={styles.paragraph}>
              The Service Provider agrees to perform the following services for the Client: 
              {"\n"}{projectScope}
            </Text>

            <Text style={styles.sectionTitle}>2. Compensation</Text>
            <Text style={styles.paragraph}>
              For the services defined above, the Client agrees to remunerate the Service Provider as follows:
              {"\n"}{compensation}
            </Text>

            <Text style={styles.sectionTitle}>3. Timeline & Duration</Text>
            <Text style={styles.paragraph}>
              {duration}
            </Text>
            
            <Text style={styles.sectionTitle}>4. Governing Law</Text>
            <Text style={styles.paragraph}>
              This SOW shall be governed by the laws of {governingLaw}.
            </Text>
          </View>
        )}

        {/* RETAINER TEMPLATE */}
        {type === "retainer" && (
          <View>
            <Text style={styles.header}>Monthly Retainer Agreement</Text>
            
            <Text style={styles.paragraph}>
              This Retainer Agreement is effective {dateStr} (the &quot;Effective Date&quot;), by and between:
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Consultant:</Text>
              <Text style={styles.value}>{freelancerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Client:</Text>
              <Text style={styles.value}>{clientName}</Text>
            </View>

            <Text style={styles.sectionTitle}>1. Services Provided</Text>
            <Text style={styles.paragraph}>
              The Consultant will provide ongoing professional services to the Client on a monthly retainer basis. 
              {"\n"}{projectScope}
            </Text>

            <Text style={styles.sectionTitle}>2. Retainer Fee</Text>
            <Text style={styles.paragraph}>
              The Client agrees to pay the Consultant a fixed monthly retainer fee of:
              {"\n"}{compensation}
              {"\n"}Invoices will be issued simultaneously with this agreement or on the 1st of every month.
            </Text>

            <Text style={styles.sectionTitle}>3. Term & Termination</Text>
            <Text style={styles.paragraph}>
              {duration} 
              {"\n"}Either party may terminate this agreement with 30 days prior written notice.
            </Text>
          </View>
        )}

        {/* SIGNATURE BLOCK */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine}>
            <Text style={{ fontWeight: 600 }}>{freelancerName}</Text>
            <Text style={styles.date}>Date: ________________</Text>
          </View>
          <View style={styles.signatureLine}>
            <Text style={{ fontWeight: 600 }}>{clientName}</Text>
            <Text style={styles.date}>Date: ________________</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
