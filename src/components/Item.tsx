import { CalendarDays, Clock, FileText, GraduationCap, MapPin, Presentation } from "lucide-react";
import FlipClockCountdown from "~/components/FlipClockCountdown";
import type { Seminar } from "~/server/routers/hello";
import { trpc } from "~/utils/trpc";

type TypeSem = "current" | "notyet" | "scheduled" | "passed";

const Item = (props: { e: Seminar; type: TypeSem }) => {
  const utils = trpc.useContext();

  const getClasess = (t: TypeSem) => {
    let className = "";
    if (t === "current") {
      className = "p-1 bg-gradient-to-tr from-green-500 border-none to-sky-500";
    } else if (t === "scheduled") {
      className = "border-yellow-400";
    } else if (t === "notyet") {
      className = "border-purple-400";
    } else if (t === "passed") {
      className = "text-gray-400 border-gray-500";
    }
    return className;
  };

  const { e, type } = props;

  return (
    <div
      className={`mb-5 border-2 rounded-lg ${
        type !== "current" ? "p-5" : ""
      }  text-white ${getClasess(type)}`}
    >
      <div
        className={`${type === "current" ? "gradient rounded-lg bg-gray-900 p-4" : ""}${
          type === "passed" ? "text-gray-500" : ""
        }`}
      >
        <div className={`font-bold text-xl mb-2 `}>{e.judul}</div>
        <div className="">
          <span className="font-semibold">{e.nama} </span>
          <span> - </span>
          <span className="font-semibold">{e.nim}</span>
        </div>
        <div className="mb-5">
          {e.date.day.hari !== "" && (
            <div className="flex flex-row items-center my-1">
              <CalendarDays size={16} className="mr-2" />
              <span>
                {e.date.day.hari}, {e.date.day.tanggal} - {e.date.day.bulanAsli} -{" "}
                {e.date.day.tahun}
              </span>
            </div>
          )}
          {e.date.time && (
            <div className="flex flex-row items-center mb-1">
              <Clock className="mr-2" size={16} />
              <span>
                {e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA
              </span>
            </div>
          )}
          {e.jadwal.ruang !== "" && (
            <div className="flex flex-row items-center">
              <MapPin className="mr-2" size={16} />
              <span>{e.jadwal.ruang}</span>
            </div>
          )}
          {e.sempro && (
            <div className="flex flex-row items-center mt-4">
              <FileText className="mr-2" size={16} />
              <span>Seminar Proposal</span>
            </div>
          )}
          {e.semhas && (
            <div className="flex flex-row items-center mt-4">
              <Presentation size={16} className="mr-2" />
              {/* <HiPresentationChartLine className="mr-2" /> */}
              <span>Seminar Hasil</span>
            </div>
          )}
          {e.pendadaran && (
            <div className="flex flex-row items-center mt-4">
              <GraduationCap size={16} className="mr-2" />
              {/* <MdSchool className="mr-2" /> */}
              <span>Sidang Akhir</span>
            </div>
          )}
        </div>
        {Date.now() <= e.dateInt.akhir && type === "current" && (
          <>
            <div className="mb-2 font-medium">Berakhir dalam:</div>
            <FlipClockCountdown
              showSeparators={false}
              className="flip-clock"
              labels={["Hari", "Jam", "Menit", "Detik"]}
              onComplete={async () => {
                await utils.hello.seminar.refetch();
              }}
              to={e.dateInt.akhir}
            />
          </>
        )}
        {Date.now() <= e.dateInt.mulai && type === "notyet" && (
          <div>
            <div className="mb-2 font-medium">Dimulai dalam:</div>
            <FlipClockCountdown
              showSeparators={false}
              className="flip-clock"
              labels={["Hari", "Jam", "Menit", "Detik"]}
              onComplete={async () => {
                await utils.hello.seminar.refetch();
              }}
              to={e.dateInt.mulai}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Item;
