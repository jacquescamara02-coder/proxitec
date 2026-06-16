import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { formatXAF, formatDate } from "@/lib/format";

// ---------- Convert numbers to French words (XAF) ----------
const UNITS = ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
const TENS = ["","","vingt","trente","quarante","cinquante","soixante","soixante","quatre-vingt","quatre-vingt"];

function below1000(n: number): string {
  if (n === 0) return "";
  if (n < 20) return UNITS[n];
  if (n < 100) {
    const t = Math.floor(n / 10), u = n % 10;
    if (t === 7 || t === 9) {
      const base = TENS[t];
      const rest = 10 + u;
      return base + (t === 7 && rest === 11 ? "-et-" : "-") + UNITS[rest];
    }
    if (u === 0) return TENS[t] + (t === 8 ? "s" : "");
    if (u === 1 && t !== 8) return TENS[t] + "-et-un";
    return TENS[t] + "-" + UNITS[u];
  }
  const h = Math.floor(n / 100), r = n % 100;
  const hStr = h === 1 ? "cent" : UNITS[h] + " cent" + (r === 0 ? "s" : "");
  return r === 0 ? hStr : hStr + " " + below1000(r);
}

function numberToFrench(num: number): string {
  if (num === 0) return "zéro";
  const million = Math.floor(num / 1_000_000);
  const thousand = Math.floor((num % 1_000_000) / 1000);
  const rest = num % 1000;
  const parts: string[] = [];
  if (million) parts.push((million === 1 ? "un" : below1000(million)) + " million" + (million > 1 ? "s" : ""));
  if (thousand) parts.push((thousand === 1 ? "" : below1000(thousand) + " ") + "mille");
  if (rest) parts.push(below1000(rest));
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export const InvoicePrint = ({ invoice, onClose }: { invoice: any; onClose: () => void }) => {
  const total = Number(invoice.total || 0);
  const items = invoice.items || [];
  const subtotal = items.reduce((s: number, it: any) => s + Number(it.subtotal || 0), 0);
  const totalInWords = numberToFrench(Math.round(total)) + " francs CFA";
  const invoiceNo = invoice.invoice_number;
  const dateStr = formatDate(invoice.created_at);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 max-h-[95vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center print:hidden sticky top-0 bg-card z-10">
          <div className="font-bold">Facture {invoiceNo}</div>
          <Button onClick={() => window.print()} size="sm"><Printer className="w-4 h-4 mr-2" />Imprimer</Button>
        </div>

        <div id="invoice-print" className="p-10 bg-white text-black font-serif text-[12px] leading-snug">
          {/* HEADER */}
          <div className="flex items-stretch gap-4 mb-2">
            {/* Left : logo + tags */}
            <div className="w-1/3 flex flex-col">
              <img src="/proxitec-logo.jpg" alt="PROXITEC" className="w-44 mb-2" />
              <div className="text-[10px] leading-tight">
                <div>| INFORMATIQUE | VIDEOSURVEILLANCE</div>
                <div>| TELEMATIQUE&nbsp;&nbsp;&nbsp;| GESTION DES TEMPS</div>
                <div>| RESEAUX&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;OPTIQUE&nbsp;&nbsp;| TELECOM</div>
                <div className="border-t border-dotted border-black my-1" />
                <div>proxitec111@gmail.com</div>
                <div>077.26.58.31 | 066.37.69.72</div>
              </div>
            </div>

            {/* Right : title block table */}
            <div className="flex-1 border border-black">
              <div className="grid grid-cols-[1fr_120px_120px] border-b border-black">
                <div className="px-3 py-2 italic font-bold text-2xl text-center border-r border-black">FACTURE</div>
                <div className="px-2 py-2 text-[11px] border-r border-black"><b>N° {invoiceNo}</b></div>
                <div className="px-2 py-2 text-[11px]"><b>du {dateStr}</b></div>
              </div>
              <div className="grid grid-cols-[90px_1fr] border-b border-black">
                <div className="px-2 py-2 font-bold border-r border-black">Client :</div>
                <div className="px-2 py-2 text-center font-bold">{invoice.client_name}</div>
              </div>
              {invoice.client_phone && (
                <div className="grid grid-cols-[90px_1fr] border-b border-black">
                  <div className="px-2 py-2 border-r border-black text-[10px]">Tél.</div>
                  <div className="px-2 py-2 text-center">{invoice.client_phone}</div>
                </div>
              )}
              <div className="px-2 py-1 text-center text-[10px] border-b border-black">Objet</div>
              <div className="px-2 py-2 text-center font-bold uppercase">
                {invoice.notes || "VENTE DE MATÉRIEL ET PRESTATIONS"}
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <table className="w-full border-collapse border border-black mt-6">
            <thead>
              <tr className="bg-white">
                <th className="border border-black px-2 py-2 text-center w-20 text-[11px]">Code<br />Service</th>
                <th className="border border-black px-2 py-2 text-center text-[11px]">Désignation</th>
                <th className="border border-black px-2 py-2 text-center w-16 text-[11px]">QTE</th>
                <th className="border border-black px-2 py-2 text-center w-28 text-[11px]">P.U. XAF</th>
                <th className="border border-black px-2 py-2 text-center w-28 text-[11px]">TOTAL XAF</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it: any) => (
                <tr key={it.id}>
                  <td className="border border-black px-2 py-1.5 text-center font-bold">{it.code || ""}</td>
                  <td className="border border-black px-2 py-1.5">{it.product_name}</td>
                  <td className="border border-black px-2 py-1.5 text-center">{it.quantity}</td>
                  <td className="border border-black px-2 py-1.5 text-right">{formatXAF(Number(it.unit_price)).replace(" FCFA", "")}</td>
                  <td className="border border-black px-2 py-1.5 text-right">{formatXAF(Number(it.subtotal)).replace(" FCFA", "")}</td>
                </tr>
              ))}
              {/* Empty filler rows for a clean look (up to 4) */}
              {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
                <tr key={`f-${i}`}>
                  <td className="border border-black px-2 py-1.5">&nbsp;</td>
                  <td className="border border-black px-2 py-1.5"></td>
                  <td className="border border-black px-2 py-1.5"></td>
                  <td className="border border-black px-2 py-1.5"></td>
                  <td className="border border-black px-2 py-1.5"></td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="border border-black px-3 py-2 text-right font-bold italic">SOUS-TOTAL</td>
                <td className="border border-black px-2 py-2 text-right font-bold">{formatXAF(subtotal).replace(" FCFA", "")}</td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan={4} className="border border-black px-3 py-2 text-right font-black uppercase">TOTAL XAF</td>
                <td className="border border-black px-2 py-2 text-right font-black text-base">{formatXAF(total).replace(" FCFA", "")}</td>
              </tr>
            </tbody>
          </table>

          {/* AMOUNT IN WORDS */}
          <div className="mt-8 text-[12px]">
            <b>Arrêté la présente facture à la somme de </b>
            <i>{totalInWords}</i>
          </div>

          {/* SIGNATURE */}
          <div className="mt-12">
            <div className="font-bold">Ing. Patrick Ngomezo'o Nsoh</div>
            <div>Tél. 077265831 / 066376972</div>
          </div>

          {/* FOOTER */}
          <div className="mt-16 border border-black grid grid-cols-4 text-[10px]">
            <div className="px-2 py-1.5 border-r border-black"><b>NIF.</b> 202102011333-R</div>
            <div className="px-2 py-1.5 border-r border-black"><b>RCCM.</b> GA-LBV-01-2021-A10-03344</div>
            <div className="px-2 py-1.5 border-r border-black"><b>N° compte UGB.</b> 90000750398-59</div>
            <div className="px-2 py-1.5 font-bold text-center">PROXITEC GABON</div>
          </div>
        </div>

        <style>{`
          @media print {
            @page { size: A4; margin: 12mm; }
            body * { visibility: hidden; }
            #invoice-print, #invoice-print * { visibility: visible; }
            #invoice-print { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
