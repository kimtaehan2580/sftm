	SET statement_timeout = 0;
	SET client_encoding = 'UTF8';
	SET standard_conforming_strings = on;
	SET check_function_bodies = false;
	SET client_min_messages = warning;
	
	INSERT INTO sftm.itm_role  VALUES ( 0, 'ADMIN', 	'관리자', '', 'admin',  now(), 'admin',now() );
	INSERT INTO sftm.itm_role  VALUES ( 0, 'TEST', 	    '현업', '', 'admin',  now(), 'admin',now() );
	INSERT INTO sftm.itm_role  VALUES ( 0, 'DEV', 		'개발자', '', 'admin',  now(), 'admin',now() );
	
	INSERT INTO sftm.itm_team (
            id,
            project_id,
            role_code,
            name,
            description,
            reg_user,
            reg_date,
            modify_user,
            modify_date
        ) VALUES (
           0,
            0,
            'ADMIN',
            '관리자',
            '관리자들',
            'admin',
            NOW(),
            'admin',
            NOW()
        );
	
	 INSERT INTO sftm.itm_user
		( user_id, password, "name", phone_num, birth, organization, "position", sex, team_id,  reg_user, reg_date, modify_user, modify_date, admin)
		VALUES(  
			'admin', 
			'admin', 
			'관리자', 
			'01000000000', 
			'000101', 
			'SK', 
			'관리자', 
			'M', 
			0,
			'amdin', 
			now(), 
			'amdin', 
			now(),
			'FALSE'
		);
	
	
	--itm_code_group
	INSERT INTO sftm.itm_code_group
			(code_group, code_group_name, description, use_yn, reg_user, reg_date)
	VALUES ('A001', '결함유형', '결함등록시 저장되는 유형', 'Y', 'admin', now());
	
	INSERT INTO sftm.itm_code_group
			(code_group, code_group_name, description, use_yn, reg_user, reg_date)
	VALUES ('B001', '결함상태', '결함에 상태에 대한 표기', 'Y', 'admin', now());
	
	INSERT INTO sftm.itm_code_group
			(code_group, code_group_name, description, use_yn, reg_user, reg_date)
	VALUES ('C001', '테스트케이스상태', '테스트케이스 상태에 대한 표기', 'Y', 'admin', now());
	
	INSERT INTO sftm.itm_code_group
			(code_group, code_group_name, description, use_yn, reg_user, reg_date)
	VALUES ('D001', '공지사항 유형', '공지사항 유형', 'Y', 'admin', now());
	
	
	INSERT INTO sftm.itm_code_group
			(code_group, code_group_name, description, use_yn, reg_user, reg_date)
	VALUES ('P001', 'PUSH 유형', 'PUSH 유형정보 (P001_01:결함등록, P001_02:결함상태변경, P001_03:결함종료, P001_04:공지사항, P001_04:System, P001_04:안내 )', 'Y', 'admin', now());
	
	 
	--itm_code 
	--A001 결함유형 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('A001', 'A001_01', '코딩오류', '코딩오류', 'Y', 10, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('A001', 'A001_02', '변경요청', '변경요청', 'Y', 20, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('A001', 'A001_03', '협의완료', '협의완료 (비결함이거나 수정을 하지 않기로 협의한경우)', 'Y', 30, 'admin', now());
	
	
	--B001 결함상태 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_01', '결함등록', '테스터가 결함을 등록', 'Y', 0, 'admin', now());
	--이거는 PL에이 확인하여 처리 필요 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_02', '배정완료', '개발자에게 결함이 배정된 단계', 'Y', 10, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_03', '조치완료', '개발자가 결함또는 변경사항을 조치완료', 'Y', 20, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_04', '미조치건', '비결함이거나 수정을 반영하기 힘든경우', 'Y', 30, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_05', '개발지연', '타팀연계로 인해 개발이 지연되는 경우', 'Y', 40, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_06', '결함종료', '테스터가 확인하여 결함이 종료', 'Y', 50, 'admin', now());
	 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('B001', 'B001_07', '조치반려', '테스터가 확인하여 결함을 반려한 경우', 'Y', 60, 'admin', now());
	
	--C001 테스트케이스상태 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('C001', 'C001_01', '수행전', '테스트케이스 수행대기', 'Y', 0, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('C001', 'C001_02', 'PASS', '테스트케이스 수행완료', 'Y', 0, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('C001', 'C001_03', 'FAIL', '테스트케이스 수행실패', 'Y', 0, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('C001', 'C001_04', 'NE', '테스트 대상아님', 'Y', 0, 'admin', now());
	
	
	-- D001 공지사항 코드
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('D001', 'D001_01', '공지사항', '관리자가 등록한 공지내용', 'Y', 10, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('D001', 'D001_02', '인프라', '인프라팀에서 등록한 게시글', 'Y', 20, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('D001', 'D001_03', '개발가이드', '공통/솔루션팀에서 제공한 개발가이드', 'Y', 30, 'admin', now());
	
	
	
	--C001 테스트케이스상태 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('P001', 'P001_01', '결함', '신규결함 배정 또는 타개발자 변환', 'Y', 0, 'admin', now());
	
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('P001', 'P001_02', 'System', 'System에서 자동으로 전달하는 내용', 'Y', 0, 'admin', now());
	
	 
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('P001', 'P001_03', '공지사항', '관리자가 개발/현업들에게 공지하는 내용', 'Y', 0, 'admin', now());
	
	
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('P001', 'P001_07', '결함지연안내', '결함 마지막 처리 일자가 3일(업무시간 24시간) 지난건에 대해서 개발자/테스터/PL 등에게 안내 메시지', 'Y', 60, 'admin', now());
	
	INSERT INTO sftm.itm_code
			(code_group, code_id, code_name, description, use_yn, priority, reg_user, reg_date)
	VALUES ('P001', 'P001_08', '테스트자동화', 'A', 'Y', 70, 'admin', now());
	
	
	--O, B, A
	INSERT INTO SFTM.ITM_TYPE_GROUP
			(id, TYPE_GROUP, description, use_type, reg_user, reg_date)
	VALUES (nextval('sftm.itm_type_group_id_seq'::regclass), '온라인 화면 기본 설정1', '온라인 화면 기본 설정1', 'O', 'admin', now());
	
	INSERT INTO SFTM.ITM_TYPE_GROUP
			(id, TYPE_GROUP, description, use_type, reg_user, reg_date)
	VALUES (nextval('sftm.itm_type_group_id_seq'::regclass), '기본 설정1', '기본 설정1', 'A', 'admin', now());
	
	
	INSERT INTO sftm.itm_project
	(id, project_name, start_date, end_date, use_yn, reg_user, reg_date)
	VALUES (nextval('sftm.itm_project_id_seq'::regclass), '단위테스트 1차', to_char(current_date, 'YYYYMMDD'), to_char(current_date + 14, 'YYYYMMDD'), 'Y', 'admin', now());
	
	INSERT INTO sftm.itm_project
	(id, project_name, start_date, end_date, use_yn, reg_user, reg_date)
	VALUES (nextval('sftm.itm_project_id_seq'::regclass), '통합테스트', to_char(current_date+ 15, 'YYYYMMDD'), '99991231', 'Y', 'admin', now());
	
	
