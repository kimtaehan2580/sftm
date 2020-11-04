package com.skcc.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.ibm.icu.util.ChineseCalendar;

@Component
public class ProcessTime {
	
	private Logger log = LoggerFactory.getLogger(Process.class);
	
	public long getProcessTime(String startTime, String endTime) throws ParseException {
		
//		log.info( "시간비교 함수 Call");
//		log.info( startTime + " ::: " + endTime);
		
		
//		2020-09-08 11:27 ::: 2020-09-09 16:56
//		DEBUG: com.skcc.batch.TimeScheduled - nextDay : 2020-09-09 11:27
//		DEBUG: com.skcc.batch.TimeScheduled - calDate : -41220000
//		INFO : com.skcc.batch.TimeScheduled - isProcessTime : -900

		String startTime1 = startTime.substring(0, 10);
		int startTime2 = Integer.parseInt(startTime.substring(11).replace(":", ""));
		
		if(startTime2 < 900) {
			startTime = startTime1 + " 09:00";
		}
		else if(startTime2 > 1800) {
			startTime = startTime1 + " 18:00";
		}

		String endTime1 = endTime.substring(0, 10);
		int endTime2 = Integer.parseInt(endTime.substring(11).replace(":", ""));	
		
		if(endTime2 < 900) {
			endTime = endTime1 + " 09:00";
		}
		else if(endTime2 > 1800) {
			endTime = endTime1 + " 18:00";
		}
//		log.info( "시간정렬 이후 함수 Call");
//		log.info( startTime + " ::: " + endTime);
		
		
		 SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");

			 
			 
		// date1, date2 두 날짜를 parse()를 통해 Date형으로 변환.
        Date StrartDate 	= format.parse(startTime);
        Date EndDate	 	= format.parse(endTime);
        
        
        //같은 일자의 경우 
        if(startTime1.equals(endTime1)) {
            
        	//주말에 입력된 데이터는 0으로 설정해야지
        	if(isHoliday(StrartDate.getTime())) {
        		return 0;
        	}
        	
        	long calDate = EndDate.getTime() - StrartDate.getTime(); 
            long calDateDays = calDate / ( 60*1000); 
            
            return calDateDays;
            
        }
        else {
        	
        	long isProcessTime = 0;
        	
        	if(!isHoliday(StrartDate.getTime())) {
        		Date tempDate = format.parse(startTime1 + " 18:00");
        		long calDate = tempDate.getTime() - StrartDate.getTime(); 
        		long calDateDays = calDate / ( 60*1000); 
        		
//        		log.debug("시작시간부터 18시까지: " + calDateDays);
        		isProcessTime += calDateDays;
        	}
        	
        	if(!isHoliday(EndDate.getTime())) {
        		Date tempDate = format.parse(endTime1 + " 09:00");
        		long calDate = EndDate.getTime() - tempDate.getTime(); 
        		long calDateDays = calDate / ( 60*1000); 
//        		log.debug("9시부터 종료시까지: " + calDateDays);
        		isProcessTime += calDateDays;
        	}
        	
        	Date endDate =  format.parse(endTime1 + " 00:00");
        	
        	Date nextDay = StrartDate;
        	
        	while(true) {
        		
        		nextDay = new Date(nextDay.getTime() + (1000 * 60 * 60 * 24));
        		
        		
//        		log.debug("nextDay : "+ format.format(nextDay));
        		long calDate = endDate.getTime()-nextDay.getTime(); 
        		
//        		log.debug("calDate : "+ calDate);
        		if( calDate < 1) {
        			break;
        		}
        		
        		//업무시간 8시간 추가됨
        		if( !isHoliday(nextDay.getTime())) {
        			isProcessTime += 1 * 60 * 8;
        		}
        		
        		
        	}
        	log.info( "isProcessTime : " + isProcessTime);
        	return isProcessTime;
        	
        }
	}


	//배치 특정 경로에 있는 파일 삭제 로직
	/*
	 * 공휴일 여부
	 * @param date
	 */
	public static boolean isHoliday(long date) {
		return isLegalHoliday(date) || isWeekend(date) || isAlternative(date);
	}
 
  /**
   * 음력날짜 구하기
   * @param date
   * @return
   */
  public static String getLunarDate(long date) {
      ChineseCalendar cc = new ChineseCalendar(new java.util.Date(date));
      String m = String.valueOf(cc.get(ChineseCalendar.MONTH) + 1);
      m = StringUtils.leftPad(m, 2, "0");
      String d = String.valueOf(cc.get(ChineseCalendar.DAY_OF_MONTH));
      d = StringUtils.leftPad(d, 2, "0");
     
      return m + d;
  }
 
  /**
   * 법정휴일
   * @param date
   * @return
   */
  public static boolean isLegalHoliday(long date) {
      boolean result = false;
     
      String[] solar = {"0101", "0301", "0505", "0606", "0815", "1225"};
      String[] lunar = {"0101", "0102", "0408", "0814", "0815", "0816", "1231"};
     
      List<String> solarList = Arrays.asList(solar);
      List<String> lunarList = Arrays.asList(lunar);
     
      String solarDate = DateFormatUtils.format(date, "MMdd");
      
      Date newDate = new Date(date);
      
//      ChineseCalendar cc = new ChineseCalendar(newDate);
      
      ChineseCalendar  cc = new ChineseCalendar();
      Calendar cal = Calendar.getInstance() ;         
      
//      
//      cal.set(Calendar.YEAR, Integer.parseInt(dt.substring(0, 4)));
//      cal.set(Calendar.MONTH, Integer.parseInt(dt.substring(5, 7)) - 1);
//      cal.set(Calendar.DAY_OF_MONTH, Integer.parseInt(dt.substring(8,10)));
//      chinaCal.setTimeInMillis(cal.getTimeInMillis());


      cc.setTimeInMillis(date);

     
//      String y = String.valueOf(cc.get(ChineseCalendar.EXTENDED_YEAR) - 2637);
      String m = String.valueOf(cc.get(ChineseCalendar.MONTH) + 1);
      m = StringUtils.leftPad(m, 2, "0");
      String d = String.valueOf(cc.get(ChineseCalendar.DAY_OF_MONTH));
      d = StringUtils.leftPad(d, 2, "0");
     
      String lunarDate = m + d;
     
      if (solarList.indexOf(solarDate) >= 0) {
          return true;
      }
      if (lunarList.indexOf(lunarDate) >= 0) {
          return true;
      }
     
      return result;
  }
 
  /**
   * 주말 (토,일)
   * @param date
   * @return
   */
  public static boolean isWeekend(long date) {
      boolean result = false;
     
      Calendar calendar = Calendar.getInstance();
      calendar.setTimeInMillis(date);
     
      //SUNDAY:1 SATURDAY:7
      int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
      if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
          result = true;
      }
     
      return result;
  }
 
  /**
   * 대체공휴일
   * @param date
   * @return
   */
  public static boolean isAlternative(long date) {
      boolean result = false;
     
      //설날 연휴와 추석 연휴가 다른 공휴일과 겹치는 경우 그 날 다음의 첫 번째 비공휴일을 공휴일로 하고, 어린이날이 토요일 또는 다른 공휴일과 겹치는 경우 그 날 다음의 첫 번째 비공휴일을 공휴일로 함
      //1. 어린이날
//      String year = DateFormatUtils.format(date, "yyyy");
//      java.util.Date d = null;
//      try {
//          d = DateUtils.parseDate(year+"0505", "yyyyMMdd");
//      } catch (ParseException e) {}
//      if (isWeekend(d.getTime()) == true) {
//          d = DateUtils.addDays(d, 1);
//      }
//      if (isWeekend(d.getTime()) == true) {
//          d = DateUtils.addDays(d, 1);
//      }
//      if (DateUtils.isSameDay(new java.util.Date(date), d) == true) {
//          result = true;
//      }
     
      //2. 설
//      String lunarDate = getLunarDate(date);
//      Calendar calendar = Calendar.getInstance();
//      d = new java.util.Date(date);
//      if (StringUtils.equals(lunarDate, "0103")) {
//         
//          d = DateUtils.addDays(d, -1);
//          calendar.setTime(d);
//          if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
//              return true;
//          }
//         
//          d = DateUtils.addDays(d, -1);
//          calendar.setTime(d);
//          if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
//              return true;
//          }
//         
//          d = DateUtils.addDays(d, -1);
//          calendar.setTime(d);
//          if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
//              return true;
//          }
//      }
     
      //3. 추석
//      d = new java.util.Date(date);
//      if (StringUtils.equals(lunarDate, "0817")) {
//          d = DateUtils.addDays(d, -1);
//          calendar.setTime(d);
//          if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
//              return true;
//          }
//         
//          d = DateUtils.addDays(d, -1);
//          calendar.setTime(d);
//          if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
//              return true;
//          }
//         
//          d = DateUtils.addDays(d, -1);
//          calendar.setTime(d);
//          if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
//              return true;
//          }
//      }
     
      return result;
  }
}
