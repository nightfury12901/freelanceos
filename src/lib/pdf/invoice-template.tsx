/**
 * GST Invoice PDF Template
 * Uses @react-pdf/renderer — runs exclusively on the server (Node.js).
 * Following Indian GST invoice formatting requirements.
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface InvoiceItem {
  name: string;
  sac: string;
  rate: number;
  amount: number;
}

export interface InvoicePDFProps {
  invoiceNumber: string;
  invoiceDate: string;
  // Seller (freelancer) details
  sellerName: string;
  sellerGstin: string;
  sellerAddress: string;
  // Client details
  clientName: string;
  clientGstin?: string | null;
  clientAddress: string;
  clientStateCode: string;
  // Invoice specifics
  type: "domestic" | "export";
  lutNumber?: string | null;
  items: InvoiceItem[];
  // Computed
  subtotal: number;
  gstAmount: number;
  total: number;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const colors = {
  navy: "#0f172a",
  teal: "#0d9488",
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate300: "#cbd5e1",
  slate500: "#64748b",
  slate700: "#334155",
  white: "#ffffff",
  black: "#000000",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.slate700,
    backgroundColor: colors.white,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  // ── Header ──────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
  },
  brandBlock: {
    flexDirection: "column",
    gap: 2,
  },
  brandName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.navy,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 8,
    color: colors.slate500,
  },
  invoiceMeta: {
    alignItems: "flex-end",
    flexDirection: "column",
    gap: 3,
  },
  invoiceTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.navy,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontSize: 9,
    color: colors.slate500,
  },
  exportBadge: {
    marginTop: 4,
    backgroundColor: colors.teal,
    color: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // ── Parties ──────────────────────────────────────
  partiesRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  partyBox: {
    flex: 1,
    backgroundColor: colors.slate50,
    borderRadius: 4,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.slate300,
  },
  partyLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.teal,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  partyName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.navy,
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: 8,
    color: colors.slate500,
    lineHeight: 1.5,
  },
  gstinRow: {
    flexDirection: "row",
    marginTop: 4,
    gap: 4,
    alignItems: "center",
  },
  gstinLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.slate500,
  },
  gstinValue: {
    fontSize: 7,
    color: colors.slate700,
    fontFamily: "Helvetica-Bold",
  },
  // ── LUT Row ──────────────────────────────────────
  lutRow: {
    flexDirection: "row",
    backgroundColor: "#f0fdf9",
    borderWidth: 0.5,
    borderColor: colors.teal,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    gap: 10,
    alignItems: "center",
  },
  lutLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.teal,
  },
  lutValue: {
    fontSize: 8,
    color: colors.slate700,
  },
  // ── Line Items Table ──────────────────────────────
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.navy,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 1,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.slate100,
  },
  tableRowAlt: {
    backgroundColor: colors.slate50,
  },
  tableCell: {
    fontSize: 8,
    color: colors.slate700,
  },
  // Column widths
  colDesc: { flex: 4 },
  colSac: { flex: 2 },
  colRate: { flex: 1.5, textAlign: "right" },
  colAmount: { flex: 2, textAlign: "right" },
  colGst: { flex: 2, textAlign: "right" },
  colTotal: { flex: 2.5, textAlign: "right" },
  // ── Totals ──────────────────────────────────────
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalsBox: {
    width: 220,
    borderTopWidth: 2,
    borderTopColor: colors.slate300,
    paddingTop: 8,
    gap: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 9,
    color: colors.slate500,
  },
  totalValue: {
    fontSize: 9,
    color: colors.slate700,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.navy,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.teal,
  },
  // ── Export note ──────────────────────────────────
  zeroRatedNote: {
    marginTop: 4,
    fontSize: 7,
    color: colors.teal,
    textAlign: "right",
  },
  // ── Footer ──────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: colors.slate300,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerNote: {
    fontSize: 7,
    color: colors.slate500,
  },
  footerBrand: {
    fontSize: 7,
    color: colors.teal,
    fontFamily: "Helvetica-Bold",
  },
});

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatINR(n: number): string {
  return `\u20B9${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ── Template Component ────────────────────────────────────────────────────────

export function InvoicePDFTemplate(props: InvoicePDFProps) {
  const {
    invoiceNumber,
    invoiceDate,
    sellerName,
    sellerGstin,
    sellerAddress,
    clientName,
    clientGstin,
    clientAddress,
    type,
    lutNumber,
    items,
    subtotal,
    gstAmount,
    total,
  } = props;

  return (
    <Document
      title={`Invoice ${invoiceNumber}`}
      author={sellerName}
      subject="GST Invoice - FreelanceOS"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>FreelanceOS</Text>
            <Text style={styles.brandTagline}>GST Compliance for Indian Freelancers</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>Tax Invoice</Text>
            <Text style={styles.invoiceNumber}>No. {invoiceNumber}</Text>
            <Text style={styles.invoiceNumber}>Date: {invoiceDate}</Text>
            {type === "export" && (
              <Text style={styles.exportBadge}>Export — Zero-Rated (LUT)</Text>
            )}
          </View>
        </View>

        {/* ── Parties ── */}
        <View style={styles.partiesRow}>
          {/* Seller */}
          <View style={styles.partyBox}>
            <Text style={styles.partyLabel}>Bill From</Text>
            <Text style={styles.partyName}>{sellerName}</Text>
            <Text style={styles.partyDetail}>{sellerAddress}</Text>
            <View style={styles.gstinRow}>
              <Text style={styles.gstinLabel}>GSTIN:</Text>
              <Text style={styles.gstinValue}>{sellerGstin}</Text>
            </View>
          </View>
          {/* Client */}
          <View style={styles.partyBox}>
            <Text style={styles.partyLabel}>Bill To</Text>
            <Text style={styles.partyName}>{clientName}</Text>
            <Text style={styles.partyDetail}>{clientAddress}</Text>
            {clientGstin && (
              <View style={styles.gstinRow}>
                <Text style={styles.gstinLabel}>GSTIN:</Text>
                <Text style={styles.gstinValue}>{clientGstin}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── LUT Note ── */}
        {type === "export" && lutNumber && (
          <View style={styles.lutRow}>
            <Text style={styles.lutLabel}>LUT Number:</Text>
            <Text style={styles.lutValue}>{lutNumber}</Text>
            <Text style={styles.lutLabel}>  |  </Text>
            <Text style={styles.lutValue}>
              Supply made under LUT — IGST not applicable (Section 16(3)(a) IGST Act)
            </Text>
          </View>
        )}

        {/* ── Line Items Table ── */}
        {/* Header Row */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description of Service</Text>
          <Text style={[styles.tableHeaderCell, styles.colSac]}>SAC</Text>
          <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          <Text style={[styles.tableHeaderCell, styles.colRate]}>GST%</Text>
          <Text style={[styles.tableHeaderCell, styles.colGst]}>GST Amt</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
        </View>

        {/* Data Rows */}
        {items.map((item, i) => {
          const itemGst = (item.amount * item.rate) / 100;
          const itemTotal = item.amount + itemGst;
          return (
            <View
              key={i}
              style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]}
            >
              <Text style={[styles.tableCell, styles.colDesc]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.colSac]}>{item.sac}</Text>
              <Text style={[styles.tableCell, styles.colAmount]}>{formatINR(item.amount)}</Text>
              <Text style={[styles.tableCell, styles.colRate]}>{item.rate}%</Text>
              <Text style={[styles.tableCell, styles.colGst]}>{formatINR(itemGst)}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>{formatINR(itemTotal)}</Text>
            </View>
          );
        })}

        {/* ── Totals ── */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatINR(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {type === "export" ? "IGST (Zero-Rated)" : "GST"}
              </Text>
              <Text style={styles.totalValue}>{formatINR(gstAmount)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Amount</Text>
              <Text style={styles.grandTotalValue}>{formatINR(total)}</Text>
            </View>
            {type === "export" && (
              <Text style={styles.zeroRatedNote}>* Zero-rated export supply under LUT</Text>
            )}
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerNote}>
            This is a computer-generated invoice. No signature required.
          </Text>
          <Text style={styles.footerBrand}>FreelanceOS • Made in India 🇮🇳</Text>
        </View>
      </Page>
    </Document>
  );
}
