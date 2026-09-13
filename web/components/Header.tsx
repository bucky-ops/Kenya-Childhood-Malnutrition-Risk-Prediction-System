import { Stethoscope, Calendar, Database } from 'lucide-react';

export default function Header({
  generatedAt,
  totalRecords,
}: {
  generatedAt: string;
  totalRecords: number;
}) {
  return (
    <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5" aria-hidden="true">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Kenya Childhood Malnutrition Risk Prediction
              </h1>
              <p className="text-emerald-100 text-sm md:text-base">
                Decision Support Dashboard · County-level ML predictions
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Updated {generatedAt}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <Database className="w-4 h-4" aria-hidden="true" />
              {totalRecords.toLocaleString()} records
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
