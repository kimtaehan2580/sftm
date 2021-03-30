SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

---------------------------------------------------------------------
--0. 스키마명 SFTM 
---------------------------------------------------------------------
CREATE SCHEMA sftm;
ALTER SCHEMA sftm OWNER TO sftm_admin;
--SET search_path = sftm, pg_catalog;
 
---------------------------------------------------------------------
-- 1. 사용자 테이블 (sftm.itm_user) 
---------------------------------------------------------------------
CREATE TABLE sftm.itm_user
(
  user_id character varying(30) NOT NULL,
  password character varying(256) NOT NULL,
  name character varying(256),
  phone_num character varying(64),
  birth character varying(6),
  sex character varying(1),
  organization character varying(256),
  "position" character varying(256),
  team_id bigint,
  reg_user character varying(256) NOT NULL,
  reg_date timestamp without time zone DEFAULT now(),
  modify_user character varying(256),
  modify_date timestamp without time zone,
  admin boolean DEFAULT false,
  use_yn character varying(1)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sftm.itm_user OWNER TO sftm_admin;
ALTER TABLE sftm.itm_user ADD PRIMARY KEY(user_id); 





---------------------------------------------------------------------
-- 2. 역할 테이블 (sftm.itm_role) 
---------------------------------------------------------------------
CREATE TABLE sftm.itm_role (
    project_id bigint NOT NULL,
    code character varying(20),
    name character varying(256),
    description character varying(256),
    reg_user character varying(256) NOT NULL,
    reg_date timestamp without time zone DEFAULT now(),
    modify_user character varying(256),
    modify_date timestamp without time zone 
);
  
ALTER TABLE sftm.itm_role OWNER TO sftm_admin;
ALTER TABLE sftm.itm_role ADD PRIMARY KEY(code);


---------------------------------------------------------------------
-- 3. 팀 테이블 (sftm.itm_team) 
--------------------------------------------------------------------- 
CREATE SEQUENCE sftm.itm_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 
CREATE TABLE sftm.itm_team (
    id bigint DEFAULT nextval('sftm.itm_team_id_seq'::regclass) NOT NULL,
    name character varying(256),
    project_id bigint NOT NULL,
    role_code character varying(20),
    reader_id character varying(20),
    description text,
    reg_user character varying(256) NOT NULL,
    reg_date timestamp without time zone DEFAULT now(),
    modify_user character varying(256),
    modify_date timestamp without time zone
);
 
ALTER SEQUENCE 	sftm.itm_team_id_seq OWNED BY sftm.itm_team.id;
ALTER TABLE 	sftm.itm_team OWNER TO sftm_admin;
ALTER TABLE 	sftm.itm_team ADD PRIMARY KEY(id);

 

---------------------------------------------------------------------
-- 3. 업무구분 테이블 (sftm.itm_div) 
-- 업무구분 3depth로 정리됨 
-- 서브시스템, 업무구분, 대상업무
--------------------------------------------------------------------- 
CREATE SEQUENCE sftm.itm_div_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 
CREATE TABLE sftm.itm_div (
    div_id character varying(10)  NOT NULL,
    project_id bigint NOT NULL,
    name character varying(256),
    depth character varying(1),
    upcode character varying(10),
    team_id bigint,
    reg_user character varying(256) NOT NULL,
    reg_date timestamp without time zone DEFAULT now(),
    modify_user character varying(256),
    modify_date timestamp without time zone 
);

ALTER SEQUENCE 	sftm.itm_div_id_seq OWNED BY sftm.itm_div.div_id;
ALTER TABLE 	sftm.itm_div OWNER TO sftm_admin;
ALTER TABLE 	sftm.itm_div ADD PRIMARY KEY(div_id);

 
---------------------------------------------------------------------
-- 5. 시나리오 테이블 (sftm.itm_scenario)  
--------------------------------------------------------------------- 
CREATE SEQUENCE sftm.itm_scenario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
    
CREATE TABLE sftm.itm_scenario
(
  scenario_id bigint    NOT NULL,
  scenario_code character varying(100) NOT NULL, -- 시나리오코드
  scenario_name character varying(200) NOT NULL, -- 시나리오명
  div_id character varying(10), -- 업무구분
  is_batch character varying(1) NOT NULL, -- 배치여부
  project_id bigint NOT NULL, -- 프로젝트ID
  description text, -- 설명
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  modify_user character varying(64), -- 수정자
  modify_date timestamp with time zone -- 수정일자
)
WITH (
  OIDS=FALSE
);


ALTER SEQUENCE 	sftm.itm_scenario_id_seq OWNED BY sftm.itm_scenario.scenario_id;
ALTER TABLE sftm.itm_scenario ADD PRIMARY KEY(scenario_id);
ALTER TABLE sftm.itm_scenario OWNER TO sftm_admin;

 
---------------------------------------------------------------------
-- 6. 테스트케이스 테이블 (sftm.itm_test_case)  
--------------------------------------------------------------------- 

CREATE SEQUENCE sftm.itm_test_case_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
    
CREATE TABLE sftm.itm_test_case
(
  scenario_id bigint NOT NULL, -- 시나리오ID
  case_id bigint NOT NULL, -- 케이스코드
  case_name character varying(200), -- 케이스명
  project_id bigint NOT NULL, -- 프로젝트ID
  tester_id character varying(30),
  dev_id character varying(30), 
  state character varying(20), 
  description text, -- 설명
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  imgkey bigint,
  modify_user character varying(64), -- 수정자
  modify_date timestamp with time zone -- 수정일자
)
WITH (
  OIDS=FALSE
);
ALTER SEQUENCE 	sftm.itm_test_case_id_seq OWNED BY sftm.itm_test_case.case_id;
ALTER TABLE sftm.itm_test_case ADD PRIMARY KEY(scenario_id, case_id);
ALTER TABLE sftm.itm_test_case OWNER TO sftm_admin; 




---------------------------------------------------------------------
-- 7. 결함 테이블  (sftm.itm_defect)--------------------------------------  
---------------------------------------------------------------------
CREATE SEQUENCE sftm.itm_defect_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 

CREATE TABLE sftm.itm_defect
(
  defect_id bigint DEFAULT nextval('sftm.itm_defect_id_seq'::regclass) NOT NULL,
  project_id bigint NOT NULL, -- 프로젝트ID
  scenario_id bigint NOT NULL NOT NULL, -- 시나리오ID
  case_id bigint NOT NULL, -- 케이스코드
  title character varying(200), -- 결함명
  description text, -- 설명
  defect_type character varying(10) NOT NULL, -- 결함유형
  defect_code character varying(10) NOT NULL, -- 결함코드
  test_id character varying(64), -- 담당현업
  dev_id character varying(64),  -- 담당개발자 
  resolve_date timestamp with time zone, -- 조치해결일자
  imgkey bigint,
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자
  modify_user character varying(64), -- 수정자
  modify_date timestamp with time zone -- 수정일자 
)
WITH (
  OIDS=FALSE
);
ALTER SEQUENCE  sftm.itm_defect_id_seq OWNED BY sftm.itm_defect.defect_id;
ALTER TABLE 	sftm.itm_defect OWNER TO sftm_admin; 
ALTER TABLE 	sftm.itm_defect ADD PRIMARY KEY(defect_id);



CREATE TABLE sftm.itm_defect_history
(
  defect_id bigint  NOT NULL,
  seq bigint  NOT NULL,
  defect_type character varying(10) NOT NULL, -- 결함유형
  defect_code character varying(10) NOT NULL, -- 결함코드
  test_id character varying(64), -- 담당현업
  dev_id character varying(64),  -- 담당개발자 
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone -- 등록일자
)
WITH (
  OIDS=FALSE
); 
ALTER TABLE 	sftm.itm_defect_history OWNER TO sftm_admin; 
ALTER TABLE 	sftm.itm_defect_history ADD PRIMARY KEY(defect_id, seq);

----------------------------------------------------------------- 
-- 8. 이미지 테이블  (sftm.itm_img)------------------------------------  
----------------------------------------------------------------- 
CREATE SEQUENCE sftm.itm_img_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE sftm.itm_img
(
  id bigint DEFAULT nextval('sftm.itm_img_id_seq'::regclass) NOT NULL,
  seq bigint,
  tbName character varying(100) NOT NULL, -- 시나리오ID
  tbDate character varying(8) NOT NULL, -- 시나리오ID
  saveFileName character varying(256) NOT NULL, -- 시나리오ID
  originFileName character varying(256) NOT NULL, -- 시나리오ID
  fileLength bigint, -- 시나리오ID
  ext character varying(10) NOT NULL, -- 시나리오ID
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone -- 등록일자
)
WITH (
  OIDS=FALSE
);
ALTER SEQUENCE sftm.itm_img_id_seq OWNED BY sftm.itm_img.id;
ALTER TABLE sftm.itm_img OWNER TO sftm_admin;
ALTER TABLE sftm.itm_img ADD PRIMARY KEY(id, seq); 


---------------------------------------------------------------------
-- 9. 코드그룹 테이블  (sftm.itm_code_group)-------------------------------- 
--------------------------------------------------------------------- 
CREATE TABLE  sftm.itm_code_group
(
  code_group character varying(30) NOT NULL, -- 코드그룹식별자
  code_group_name character varying(200), -- 코드그룹명
  description text, -- 설명
  use_yn character varying(1) DEFAULT 'Y', -- 사용여부
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone -- 등록일자
  -- CONSTRAINT itm_code_group_pk PRIMARY KEY (code_group)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sftm.itm_code_group OWNER TO sftm_admin;
ALTER TABLE sftm.itm_code_group ADD PRIMARY KEY(code_group); 

 

-------------------------------------------------------------- 
-- 10. 코드 테이블  (sftm.itm_code)-------------------------------- 
-------------------------------------------------------------- 
CREATE TABLE sftm.itm_code
(
  code_group character varying(30) NOT NULL, -- 코드그룹식별자
  code_id 	character varying(30) NOT NULL, -- 코드명
  code_name character varying(200) NOT NULL, -- 코드명
  description text, -- 설명
  use_yn character varying(1) DEFAULT 'Y', -- 사용여부  
  priority bigint,
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone, -- 등록일자 
  CONSTRAINT  itm_code_fk FOREIGN KEY (code_group)
      REFERENCES sftm.itm_code_group (code_group) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE  sftm.itm_code OWNER TO sftm_admin; 
ALTER TABLE  sftm.itm_code ADD PRIMARY KEY(code_group, code_id);


-- 코드 조회 Function
CREATE FUNCTION sftm.GET_CODENAME(_group TEXT, _code TEXT)
RETURNS TEXT AS $$
DECLARE codename TEXT;
BEGIN
        SELECT  code_name INTO codename
        FROM    sftm.itm_code
        WHERE   code_group = $1
        AND     code_id = $2;

        RETURN codename;
END;
$$  LANGUAGE plpgsql;



CREATE FUNCTION sftm.GET_WHAT_DAY(reg_date timestamp with time zone)
RETURNS TEXT AS $$
DECLARE whatday TEXT;
BEGIN
        SELECT  (
			CASE WHEN (now() - reg_date) > interval'1 year' then cast( to_char(now() - reg_date, 'YY') as INTEGER) || '년전'
			  WHEN (now() - reg_date) > interval'1 month' then  cast( to_char(now() - reg_date, 'MM')as INTEGER) || '개월전'
			  WHEN (now() - reg_date) > interval'1 day' then cast(to_char(now() - reg_date, 'dd') as INTEGER) || '일전'
			  WHEN (now() - reg_date) > interval'1 hours' then cast(to_char(now() - reg_date, 'hh')as INTEGER) || '시간전' 
			  WHEN (now() - reg_date) < interval'1 minute' then '지금' 
			  else cast(to_char(now() - reg_date, 'MI')as INTEGER) || '분전' end
		) as whatday
		INTO whatday;
     	RETURN whatday;
END;
$$  LANGUAGE plpgsql;


-------------------------------------------------------------- 
-- 11. PUSH 테이블  (sftm.itm_push)------------------------------ 
--------------------------------------------------------------  
CREATE SEQUENCE sftm.itm_push_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--2 TABLE
CREATE TABLE sftm.itm_push
(
	  id bigint DEFAULT nextval('sftm.itm_push_id_seq'::regclass) NOT NULL,
  	  push_code character varying(30) NOT NULL,
  	  title character varying(200) ,
  	  msg text, 
  	  event  character varying(256) ,
  	  recv_user character varying(256) NOT NULL, --수신자
  	  recv_yn character varying(1),
  	  recv_date timestamp with time zone, 		-- 수신일자
	  reg_user character varying(64), 			-- 등록자
	  reg_date timestamp with time zone 		-- 등록일자
)
WITH (
  OIDS=FALSE
);


ALTER TABLE sftm.itm_push_id_seq OWNER TO sftm_admin;
ALTER TABLE sftm.itm_push OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_push_id_seq OWNED BY sftm.itm_push.id;
ALTER TABLE sftm.itm_push ADD PRIMARY KEY(id);

---------------------------------------PUSH 테이블 종료 (itm_push)---  




-------------------------------------------------------------- 
-- 12. 자동화 테이블  (sftm.itm_auto)------------------------------ 
--------------------------------------------------------------   
CREATE SEQUENCE sftm.itm_auto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--2 TABLE
CREATE TABLE sftm.itm_auto 
(
	  id bigint DEFAULT nextval('sftm.itm_auto_id_seq'::regclass) NOT NULL,
	  title character varying(256), -- 제목 
	  case_id bigint NOT NULL,
	  defect_id bigint NOT NULL,
  	  html text NOT NULL,
  	  use_yn character varying(1) NOT NULL,
	  reg_user character varying(64), 			-- 등록자
	  reg_date timestamp with time zone 		-- 등록일자
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sftm.itm_auto OWNER TO sftm_admin;
ALTER TABLE sftm.itm_auto_id_seq OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_auto_id_seq OWNED BY sftm.itm_auto.id;
ALTER TABLE sftm.itm_auto ADD PRIMARY KEY(id);    
 
    
---------------------------------------------------------------------
-- 12. 테스트케이스 유형 그룹 테이블  (sftm.itm_type_group)-------------------------------- 
--------------------------------------------------------------------- 

CREATE SEQUENCE sftm.itm_type_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
    
CREATE TABLE  sftm.itm_type_group
(
  id bigint DEFAULT nextval('sftm.itm_type_group_id_seq'::regclass) NOT NULL,
  type_group character varying(200) NOT NULL, -- 유형그룹명
  description text, -- 설명
  use_type character varying(1), -- 사용여부
  reg_user character varying(64), -- 등록자
  reg_date timestamp with time zone -- 등록일자
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sftm.itm_type_group OWNER TO sftm_admin;
ALTER TABLE sftm.itm_type_group_id_seq OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_type_group_id_seq OWNED BY sftm.itm_type_group.id;
ALTER TABLE sftm.itm_type_group ADD PRIMARY KEY(id); 
    
 ---------------------------------------------------------------------
-- 12. 테스트케이스 유형  테이블  (sftm.itm_type)-------------------------------- 
---------------------------------------------------------------------     
CREATE SEQUENCE sftm.itm_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
    

--2 TABLE
CREATE TABLE sftm.itm_type
(
	  id bigint DEFAULT nextval('sftm.itm_type_id_seq'::regclass) NOT NULL,
	  type_group_id bigint  NOT NULL,
  	  case_name character varying(200) NOT NULL,
  	  case_desc text, 
  	  reg_user character varying(64), 			-- 등록자
	  reg_date timestamp with time zone 		-- 등록일자
)
WITH (
  OIDS=FALSE
);

 
ALTER TABLE sftm.itm_type OWNER TO sftm_admin;
ALTER TABLE sftm.itm_type_id_seq OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_type_id_seq OWNED BY sftm.itm_type.id;
ALTER TABLE sftm.itm_type ADD PRIMARY KEY(id);


---------------------------------------------------------------------
-- 13. PROJECT  (sftm.itm_project)-------------------------------- 
---------------------------------------------------------------------     
CREATE SEQUENCE sftm.itm_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--2 TABLE
CREATE TABLE sftm.itm_project
(
	  id bigint DEFAULT nextval('sftm.itm_project_id_seq'::regclass) NOT NULL,
	  project_name character varying(200) NOT NULL,
	  start_date character varying(8) NOT NULL,
	  end_date character varying(8) NOT NULL,
	  use_yn character varying(1) NOT NULL,
	  reg_user character varying(64), 			-- 등록자
	  reg_date timestamp with time zone 		-- 등록일자
)
WITH (
  OIDS=FALSE
);

 
ALTER TABLE sftm.itm_project OWNER TO sftm_admin;
ALTER TABLE sftm.itm_project_id_seq OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_project_id_seq OWNED BY sftm.itm_project.id;
ALTER TABLE sftm.itm_project ADD PRIMARY KEY(id);


---------------------------------------------------------------------
-- 14. 통계 테이블  (sftm.itm_stat)-------------------------------- 
---------------------------------------------------------------------     
CREATE TABLE sftm.itm_stat
(
  base_date 	character varying(8) NOT NULL,
  user_id 		character varying(20) NOT NULL,
  project_id 	bigint,
  case_cnt			bigint,
   sum_time			bigint,
   non_defect_cnt	bigint,
   delay_cnt		bigint,
   completed_cnt	bigint,
   defect_cnt		bigint,
   required_cnt		bigint,
   tran_cnt			bigint,
   real_defect_cnt	bigint, 
   reject_cnt bigint,
  reg_user character varying(256) NOT NULL,
  reg_date timestamp without time zone DEFAULT now()
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sftm.itm_stat OWNER TO sftm_admin;
ALTER TABLE sftm.itm_stat ADD PRIMARY KEY(base_date,user_id,project_id ); 

---------------------------------------------------------------------
-- 14. 댓글 테이블  (sftm.itm_comment)  -------------------------------- 
---------------------------------------------------------------------     
CREATE SEQUENCE sftm.itm_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE sftm.itm_comment
(
	  id bigint DEFAULT nextval('sftm.itm_comment_id_seq'::regclass) NOT NULL,
	  project_id bigint NOT NULL, -- 프로젝트ID
	  type_code character varying(1) NOT NULL,  -- t(testcase comment)/d(defect comment) 
	  case_id bigint,
	  defect_id bigint,
	  user_id character varying(30) NOT NULL,
	  msg text,  
	  use_yn character varying(1) NOT NULL,
	  reg_user character varying(64), 			-- 등록자
	  reg_date timestamp with time zone, 		-- 등록일자
      modify_user character varying(64),
      modify_date timestamp without time zone
)
WITH (
  OIDS=FALSE
);    

ALTER TABLE sftm.itm_comment OWNER TO sftm_admin;
ALTER TABLE sftm.itm_comment_id_seq OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_comment_id_seq OWNED BY sftm.itm_comment.id;
ALTER TABLE sftm.itm_comment ADD PRIMARY KEY(id);



---------------------------------------------------------------------
-- 15. 게시판 테이블  (sftm.itm_border)  -------------------------------- 
---------------------------------------------------------------------     
CREATE SEQUENCE sftm.itm_border_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE sftm.itm_border
(
	  id bigint DEFAULT nextval('sftm.itm_border_id_seq'::regclass) NOT NULL,
	  type_code character varying(10) NOT NULL,  -- 1 공지, 2 인프라, 3 개발가이드 
	  title character varying(100) NOT NULL,
	  msg text,  
	  manager_user character varying(30) NOT NULL, -- 담당자
	  imgkey bigint,
	  use_yn character varying(1),
	  reg_user character varying(64), 			-- 등록자
	  reg_date timestamp with time zone, 		-- 등록일자
      modify_user character varying(64),
      modify_date timestamp without time zone
)
WITH (
  OIDS=FALSE
);    

ALTER TABLE sftm.itm_border OWNER TO sftm_admin;
ALTER TABLE sftm.itm_border_id_seq OWNER TO sftm_admin;
ALTER SEQUENCE sftm.itm_border_id_seq OWNED BY sftm.itm_border.id;
ALTER TABLE sftm.itm_border ADD PRIMARY KEY(id);