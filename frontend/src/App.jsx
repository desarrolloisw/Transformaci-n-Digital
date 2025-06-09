import { NotResults } from "./components/notFound/NotResults";
import { CardProcess } from "./components/process/CardProcess";
import { DashboardCharts } from "./components/dashboard/DashboardCharts";
import { CardUser } from "./components/user/CardUser";
import { CompactTiptap } from "./components/utils/RichTextEditor";
import { useState } from "react";
import { DatesFiltersAndSelects } from "./components/utils/DateFiltersAndSelects";

const App = () => {
  const [dates, setDates] = useState({ from: "", to: "" });
  const [resetCounter, setResetCounter] = useState(0);

  const handleDatesChange = (values) => {
    setDates(values);
  };

  const handleClear = () => {
    // Aquí puedes limpiar otros campos si lo necesitas
    setDates({ from: "", to: "" });
    // ...otros resets
  };

// Mock data for processes and counts
  const process = [
    {
      id: 1,
      name: "Proceso de Inscripción",
      isActive: true,
      createdAt: "2023-10-01T12:00:00Z"
    },
    {
      id: 2,
      name: "Proceso de Evaluación",
      isActive: false,
      createdAt: "2023-10-02T12:00:00Z"
    },
    {
      id: 3,
      name: "Proceso de Admisión",
      isActive: true,
      createdAt: "2023-10-03T12:00:00Z"
    },
    {
      id: 4,
      name: "Proceso de Graduación",
      isActive: true,
      createdAt: "2023-10-04T12:00:00Z"
    },
    {
      id: 5,
      name: "Proceso de Reinscripción",
      isActive: false,
      createdAt: "2023-10-05T12:00:00Z"
    }
  ]

  const getProcessCount = [
  { "processId": 1, "processName": "Inscripciones", "count": 15 },
  { "processId": 2, "processName": "Becas", "count": 8 },
  { "processId": 3, "processName": "Titulación", "count": 0 },
  { "processId": 4, "processName": "Admisión", "count": 5 },
  { "processId": 5, "processName": "Reinscripción", "count": 12 }
]

  const getCategoryCount = [
    { "categoryId": 1, "categoryName": "Requisitos", "count": 10 },
    { "categoryId": 2, "categoryName": "Fechas", "count": 5 },
    { "categoryId": 3, "categoryName": "Costos", "count": 0 },
    { "categoryId": 4, "categoryName": "Documentación", "count": 8 },
    { "categoryId": 5, "categoryName": "Procedimientos", "count": 3 }
  ]

  const getCategoryCountByProcess = [
    { "categoryId": 1, "categoryName": "Requisitos", "count": 7 },
    { "categoryId": 2, "categoryName": "Fechas", "count": 2 },
    { "categoryId": 3, "categoryName": "Costos", "count": 0 },
    { "categoryId": 4, "categoryName": "Documentación", "count": 5 },
    { "categoryId": 5, "categoryName": "Procedimientos", "count": 1 }
  ]

  const users = [
    {
      "id": 1,
      "name": "Juan",
      "lastName": "Pérez",
      "secondLastName": "García",
      "userType": {
        "name": "Administrador"
      },
      "createdAt": "2024-06-09T10:00:00-07:00",
      "updatedAt": "2024-06-09T12:00:00-07:00",
      "isActive": true
    },
    {
      "id": 2,
      "name": "María",
      "lastName": "López",
      "secondLastName": null,
      "userType": {
        "name": "Usuario"
      },
      "createdAt": "2024-06-08T09:30:00-07:00",
      "updatedAt": "2024-06-09T11:15:00-07:00",
      "isActive": false
    }
  ]

  function getGridClass(data) {
    const count = data.length;
    const maxCols = Math.min(count, 5) || 1;

    const xsCols = 1;
    const smCols = Math.min(2, maxCols);
    const mdCols = Math.min(3, maxCols);
    const lgCols = Math.min(4, maxCols);
    const xlCols = maxCols;

    return `grid gap-4 w-full px-4 place-items-center my-6 
      grid-cols-${xsCols} 
      sm:grid-cols-${smCols} 
      md:grid-cols-${mdCols} 
      lg:grid-cols-${lgCols} 
      xl:grid-cols-${xlCols}`;
  }

  const [htmlContent, setHtmlContent] = useState('');

  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");

  return (
    <div className="bg-black flex flex-col gap-3 w-full">

      <div className={getGridClass(process)}>
        {
          process.length === 0 ? (
            <NotResults notResultsName={"Processes"} />
          ) :
          process.map((proc) => (
            <CardProcess key={proc.id} process={proc} />
          ))
        } 
      </div>

      <div className={getGridClass(users)}>
        {
          users.length === 0 ? (
            <NotResults notResultsName={"Users"} />
          ) :
          users.map((user) => (
            <CardUser key={user.id} user={user} />
          ))
        }
      </div>

      <div className={"flex flex-col items-center justify-center w-full max-w-screen-lg mx-auto px-4 my-4 min-w-11/12"}>	
        {
          getProcessCount.length === 0 ? (
            <NotResults notResultsName={"Process Count"} />
          ) :
          <DashboardCharts
            data={getProcessCount}
            xKey="processName"
            barKey="count"
            title="Preguntas por Proceso"
          />
        }
        {
          getCategoryCount.length === 0 ? (
            <NotResults notResultsName={"Category Count"} />
          ) :
          <DashboardCharts
            data={getCategoryCount}
            xKey="categoryName"
            barKey="count"
            title="Preguntas por Categoría"
          />
        }
        {
          getCategoryCountByProcess.length === 0 ? (
            <NotResults notResultsName={"Category Count by Process"} />
          ) :
          <DashboardCharts
            processName="Servicio social"
            data={getCategoryCountByProcess}
            xKey="categoryName"
            barKey="count"
            title="Preguntas por Categoría del Proceso: "
          />
        }
      </div>

      <div>
        <h2>Editor compacto Tiptap:</h2>
        <CompactTiptap onChange={setHtmlContent} />

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Vista previa:</h3>

        <div
          className="prose max-w-[450px] bg-white text-black p-4 rounded-lg border border-gray-300 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <pre className="bg-zinc-900 text-green-400 p-4 rounded-lg border border-zinc-700 overflow-x-auto text-xs max-w-[450px] whitespace-pre-wrap">
          {htmlContent}
        </pre>
      </div>
      
      <div className="p-6 bg-zinc-950 flex flex-col gap-6 items-center m-4">
        {/* Ejemplo de uso de DatesFilter con varios selects */}
        <DatesFiltersAndSelects
          onChange={handleDatesChange}
          onClear={handleClear}
          clearSignal={resetCounter} // <-- agrega esta línea
        />

        <div className="text-gray-200">
          <div>
            <b>Desde:</b> {dates.from || "No seleccionado"}
          </div>
          <div>
            <b>Hasta:</b> {dates.to || "No seleccionado"}
          </div>
        </div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={() => setResetCounter((c) => c + 1)}
        >
          Limpiar desde el padre
        </button>
      </div>

      <div className="p-6 bg-zinc-950 flex flex-col gap-6 items-center m-4">
        {/* Ejemplo de uso de DatesFilter con varios selects */}
        <DatesFiltersAndSelects
          onChange={handleDatesChange}
          onClear={handleClear}
          selectsData={[
            {
              label: "Tipo",
              options: [
                { id: 1, name: "A" },
                { id: 2, name: "B" }
              ],
              value: tipo,
              onChange: setTipo
            },
            {
              label: "Estado",
              options: [

              ],
              value: estado,
              onChange: setEstado
            }
          ]}
        />
      </div>

    </div>
  );
}

export default App;