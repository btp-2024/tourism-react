import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import ImageCrousal from './ImageCrousal';
import moment from 'moment';

function BookingHotel() {

  const hotelid = useParams().id
  const [hotelInfo, setHotelInfo] = useState(null);

  const { from, to } = useParams();

  function countDaysBetween(fromDate, toDate) {
    // Parse the dates using the 'MM-DD-YYYY' format
    const startDate = moment(fromDate, 'MM-DD-YYYY');
    const endDate = moment(toDate, 'MM-DD-YYYY');
  
    // Calculate the difference in days
    const differenceInDays = endDate.diff(startDate, 'days');
  
    return differenceInDays;
  }
  
  const totalDays = countDaysBetween(from, to);
  const total_amount = totalDays * hotelInfo?.rentperday;


  async function fetchHotel() {
    try {
      const result = await fetch(`http://localhost:8000/hotel/${hotelid}`)
      const res = await result.json()
      if(!res.success) {
        alert('Hotel not found');
        window.location.href = '/hotels';
        return;
      }
      setHotelInfo(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  // function sendMail({ bookingData }) {

  //   (function () {
  //     emailjs.init("CHATVUtbqB7CyZijK")
  //   })();

  //   const user = JSON.parse(localStorage.getItem('current-user'));
  //   var params = {
  //     sendername: "BTP Tourism",
  //     to: user.data.email,
  //     subject: "Sending Booking Invoice",
  //     replyto: "btp.tourism@gmail.com",
  //     message: bookingData
  //   }

  //   var service_id = "service_8uvfi1d";
  //   var template_id = "template_z7y3cjo";

  //   emailjs.send(service_id, template_id, params).then(
  //     res => {
  //       alter('Email sent successfully')
  //     }).catch(err => {
  //       alert('Email sending failed')
  //     })
  // }

  const bookHotel = async () => {

    if (!localStorage.getItem('current-user')) {
      alert('Please login to book vehicle');
      return;
    }
    console.log(hotelInfo)
    const user = JSON.parse(localStorage.getItem('current-user'));
    const bookingData = {
      hotel: hotelInfo,
      user_id: user.data._id,
      user_name: user.data.name,
      total_days: totalDays,
      fromD: from,
      toD:to,
      rentperday: hotelInfo.rentperday,
      total_amount: total_amount,
    }

    const confirm = window.confirm('Are you sure you want to book this hotel?');
    if (!confirm) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/booking/hotel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      const res = await response.json();
      if (res.success) {
        alert('Hotel booked successfully');
        // sendMail({ bookingData });
        window.location.href = '/hotels';
      }
      if (res.error) {
        alert('Hotel booking failed');
      }

    } catch (err) {
      alert('Hotel booking failed. Error occured: ', err)
    }
  }

  useEffect(() => {
    fetchHotel()
  }, [])


  return (

    <div className='m-5'>

      <div className='row justify-content-center mt-5 bs'>
        <div className='col-md-12 col-lg-6'>
          <h1 className='fs-3 mb-0'>{hotelInfo?.hotel_name}</h1>
          <p className='fw-light '>{hotelInfo?.city + ", " + hotelInfo?.state + ", " + hotelInfo?.country}</p>
          <hr />
          <ImageCrousal photos={[hotelInfo?.photo1, hotelInfo?.photo2, hotelInfo?.photo3, hotelInfo?.photo4, hotelInfo?.photo5]} />
        </div>
        <div className='col-md-5'>
          <div style={{ textAlign: 'left' }}>
            <h1>Booking Details</h1>
            <hr />
            <p>Booking From: {from}</p>
            <p>Booking To: {to}</p>
            <hr />
            <p>Hotel Name: {hotelInfo?.hotel_name}</p>
            <h4>Overiew</h4>
            <p>{hotelInfo?.overview}</p>
            <p>Stars: {hotelInfo?.star_rating}</p>
            <div className='d-flex flex-wrap'>
              {hotelInfo?.facility?.map((fac, index) => {
                return <p key={index} className="border border-dark m-2 p-1 rounded " style={{ borderRadius: '25%' }}>{fac}</p>
              })}
            </div>
          </div>
          <hr />
          <div style={{ textAlign: 'left' }}>
            <h1>Amount</h1>
            <p>Total days: {totalDays} </p>
            <p>Rent per day: ${hotelInfo?.rentperday} </p>
            <p>Total amount: ${total_amount}</p>
          </div>
          <div style={{ float: 'right' }}><button className='btn btn-primary' onClick={bookHotel}>Pay Now</button> </div>
        </div>

      </div>
    </div>
  )
}

export default BookingHotel
