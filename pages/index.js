import useSWR from 'swr';
import Countdown from 'react-countdown';
import { useEffect, useState } from 'react';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker, HiDocument, HiPresentationChartLine } from 'react-icons/hi';
import { MdSchool } from 'react-icons/md';

// export async function getStaticProps() {

//   const data = await fetch(`${process.env.BASE_URL}/api/hello`);
//   const {currents, scheduled, notyet, passed} = await data.json();

//   return {
//     props: {
//       currents,
//       scheduled,
//       notyet,
//       passed,
//     },
//   }
// }

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Home() {
  const base = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://seminar.dalamkotak.com';
  const url = `${base}/api/hello`;
  const { data, error } = useSWR(url, fetcher);

  if (error) return "An error has occurred.";
  if (!data) return <Spinner />
  const { currents, scheduled, notyet, passed } = data

  return (
    <div className='container 
    mx-auto mt-10'>
      {
        currents.length !== 0 && currents.map((e, i) => {
          return (
            <Item e={e} key={e.nim + i} classes="current" />
          );
        })
      }
      {notyet.length !== 0 && <div className='p-1 px-2 mb-2 rounded-xl mt-3 text-base border-2 text-purple-300 border-purple-800 w-max'>Coming Soon!</div>}
      {
        notyet.map((e, i) => {
          return (
            <Item e={e} key={e.nim + i} classes="notyet" />
          );
        })
      }
      {scheduled.length !== 0 && <div className='p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-yellow-300 border-yellow-800 w-max'>Belum Ada Jadwalnya</div>}
      {scheduled.map((e, i) => {
        return (
          <Item e={e} key={e.nim + i} classes="scheduled" />
        );
      })}
      {passed.length !== 0 && <div className='p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-gray-300 border-gray-500 w-max'>Udah Lewat</div>}
      {passed.map((e, i) => {
        return (
          <Item e={e} key={e.nim + i} classes="passed" />
        );
      }).reverse()}
    </div>
  );
}

const Item = (props) => {
  const { e, classes } = props;
  return (
    <div className={`items ${classes}`} >
      <div className={`${classes === 'current' ? 'gradient' : null}`}>
        <div className={`font-bold text-xl mb-2`}>{e.judul}</div>
        <span className='uppercase font-semibold'>{e.nama} </span>
        <span> - </span>
        <span className='font-semibold'>{e.nim}</span>
        <div className='mb-5'>
          {e.date.day.hari !== '' &&
            <div className='flex items-center flex-row my-1'>
              <HiOutlineCalendar className=' mr-2' />
              <span>{e.date.day.hari}, {e.date.day.tanggal} - {e.date.day.bulanAsli} - {e.date.day.tahun}</span>
            </div>
          }
          {e.date.time !== '' &&
            <div className='flex flex-row items-center mb-1'>
              <HiOutlineClock className='mr-2' />
              <span>{e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA</span>
            </div>
          }
          {e.jadwal.ruang !== '' &&
            <div className='flex flex-row items-center '>
              <HiOutlineLocationMarker className='mr-2' />
              <span>{e.jadwal.ruang}</span>
            </div>
          }
          {e.sempro &&
            <div className='flex flex-row items-center mt-4'>
              <HiDocument className='mr-2' />
              <span>Seminar Proposal</span>
            </div>
          }
          {e.semhas &&
            <div className='flex flex-row items-center mt-4'>
              <HiPresentationChartLine className='mr-2' />
              <span>Seminar Hasil</span>
            </div>
          }
          {e.pendadaran &&
            <div className='flex flex-row items-center mt-4'>
              <MdSchool className='mr-2' />
              <span>Seminar Akhir</span>
            </div>
          }
        </div>

        {Date.now() <= e.dateInt.akhir && classes === 'current' &&
          <Countdown date={e.dateInt.akhir} className="font-semibold" />
        }
        {Date.now() <= e.dateInt.mulai && classes === 'notyet' &&
          <Countdown date={e.dateInt.mulai} className="font-semibold" />
        }
      </div>
    </div>
  );
}

const Spinner = () => {
  return <div className='flex justify-center items-center  '>
    <svg className="animate-spin  text-white h-20 w-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
}