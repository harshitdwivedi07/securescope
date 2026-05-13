import { useState } from "react";
import Home from "./pages/Home";
import Report from "./pages/Report";

export default function App() {
  const [report, setReport] = useState(null);

  return report
    ? <Report report={report} onBack={() => setReport(null)} />
    : <Home onReport={setReport} />;
}
