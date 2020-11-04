package com.skcc.filter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;


@WebFilter(urlPatterns = "*.do")
public class ReadableRequestWrapperFilterfilter  extends OncePerRequestFilter  {
	
		private Logger log = LoggerFactory.getLogger(ReadableRequestWrapperFilterfilter.class);

	  private boolean includeResponsePayload = true;
	  private int maxPayloadLength = 1000;

	  private String getContentAsString(byte[] buf, int maxLength, String charsetName) {
	    if (buf == null || buf.length == 0) return "";
	    int length = Math.min(buf.length, this.maxPayloadLength);
	    try {
	      return new String(buf, 0, length, charsetName);
	    } catch (UnsupportedEncodingException ex) {
	      return "Unsupported Encoding";
	    }
	  }

	  /**
	   * Log each request and respponse with full Request URI, content payload and duration of the request in ms.
	   * @param request the request
	   * @param response the response
	   * @param filterChain chain of filters
	   * @throws ServletException
	   * @throws IOException
	   */
	  @Override
	  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

	    long startTime = System.currentTimeMillis();
	    StringBuffer reqInfo = new StringBuffer()
	     .append("[")
	     .append(startTime % 10000)  // request ID
	     .append("] ")
	     .append(request.getMethod())
	     .append(" ")
	     .append(request.getRequestURL());

	    String queryString = request.getQueryString();
	    if (queryString != null) {
	      reqInfo.append("?").append(queryString);
	    }

	    if (request.getAuthType() != null) {
	      reqInfo.append(", authType=")
	        .append(request.getAuthType());
	    }
	    if (request.getUserPrincipal() != null) {
	      reqInfo.append(", principalName=")
	        .append(request.getUserPrincipal().getName());
	    }

	    log.debug("=> " + reqInfo);

	    // ========= Log request and response payload ("body") ========
	    // We CANNOT simply read the request payload here, because then the InputStream would be consumed and cannot be read again by the actual processing/server.
	    //    String reqBody = DoogiesUtil._stream2String(request.getInputStream());   // THIS WOULD NOT WORK!
	    // So we need to apply some stronger magic here :-)
	    ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
	    ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

	    filterChain.doFilter(wrappedRequest, wrappedResponse);     // ======== This performs the actual request!
	    long duration = System.currentTimeMillis() - startTime;
	    
	    
	    this.logger.debug("<= " + reqInfo + ": returned status=" + response.getStatus() + " in "+duration + "ms");
	    
	    // I can only log the request's body AFTER the request has been made and ContentCachingRequestWrapper did its work.
	    String requestBody = this.getContentAsString(wrappedRequest.getContentAsByteArray(), this.maxPayloadLength,"UTF-8");
	    if (requestBody.length() > 0) {
	    	 log.debug("   Request body:\n" +requestBody);
	    }

	    if (includeResponsePayload) {
	      byte[] buf = wrappedResponse.getContentAsByteArray();
	      log.debug("   Response body:\n"+getContentAsString(buf, this.maxPayloadLength, response.getCharacterEncoding()));
	    }

	    wrappedResponse.copyBodyToResponse();  // IMPORTANT: copy content of response back into original response

	  }


}
