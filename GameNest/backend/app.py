# from flask import Flask, jsonify
# from flask_cors import CORS
# import requests, re, time
# import feedparser

# app = Flask(__name__)
# CORS(app)

# RSS_URL = "https://store.steampowered.com/feeds/news.xml"
# APP_API = "https://store.steampowered.com/api/appdetails?appids={appid}&l=koreana"

# _cache = {}
# def _get(k, ttl):
#     v = _cache.get(k)
#     if not v: return None
#     if time.time() - v["ts"] > ttl:
#         _cache.pop(k, None)
#         return None
#     return v["data"]
# def _set(k, data): _cache[k] = {"ts": time.time(), "data": data}

# def app_name(appid):
#     if not appid: return None
#     ck = f"appname_{appid}"
#     c = _get(ck, 86400)
#     if c is not None: return c
#     try:
#         r = requests.get(APP_API.format(appid=appid), timeout=8)
#         name = r.json().get(appid, {}).get("data", {}).get("name")
#         _set(ck, name)
#         return name
#     except Exception:
#         _set(ck, None); return None

# def extract_appid(link):
#     m = re.search(r"/app/(\d+)/", link or "")
#     return m.group(1) if m else None

# def fetch_news_all():
#     c = _get("steam_all_news", 600)
#     if c is not None: return c
#     feed = feedparser.parse(RSS_URL)
#     items = []
#     for e in feed.entries[:30]:
#         link = getattr(e, "link", "")
#         title = getattr(e, "title", "")
#         summary = getattr(e, "summary", "") or getattr(e, "description", "")
#         date = getattr(e, "published", None) or getattr(e, "updated", None)
#         appid = extract_appid(link)
#         name = app_name(appid) or "Steam"
#         items.append({
#             "id": link or title,
#             "gameName": name,   # 카드 맨 위
#             "title": title,     # 두번째 줄 (패치/이벤트 제목)
#             "summary": summary, # 아래 자세한 내용(요약)
#             "link": link,
#             "date": date,
#         })
#     payload = {"count": len(items), "items": items}
#     _set("steam_all_news", payload)
#     return payload

# @app.get("/api/news/all")
# def api_news_all():
#     return jsonify(fetch_news_all())

# if __name__ == "__main__":
#     app.run(host="127.0.0.1", port=5000, debug=True)

# backend/app.py





############################################
# from flask import Flask, jsonify
# from flask_cors import CORS
# import requests, re, time, html as htmllib
# import feedparser

# app = Flask(__name__)
# CORS(app)

# # ----- 설정 -----
# RSS_URL = "https://store.steampowered.com/feeds/news.xml"
# APP_API = "https://store.steampowered.com/api/appdetails?appids={appid}&l=koreana"

# HEADERS = {
#     "User-Agent": (
#         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
#         "AppleWebKit/537.36 (KHTML, like Gecko) "
#         "Chrome/120.0.0.0 Safari/537.36"
#     ),
#     "Accept-Language": "ko,en;q=0.9",
# }

# # ----- 초간단 메모리 캐시 -----
# _cache = {}

# def _get_cache(key: str, ttl_sec: int):
#     v = _cache.get(key)
#     if not v:
#         return None
#     if time.time() - v["ts"] > ttl_sec:
#         _cache.pop(key, None)
#         return None
#     return v["data"]

# def _set_cache(key: str, data):
#     _cache[key] = {"ts": time.time(), "data": data}

# # ----- 유틸: HTML → 텍스트 정리 -----
# def clean_html_to_text(raw: str) -> str:
#     """RSS summary/description에 섞인 HTML을 읽기 좋은 텍스트로 변환"""
#     if not raw:
#         return ""
#     # 줄바꿈/리스트 가독성
#     raw = raw.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
#     raw = raw.replace("</p>", "\n\n").replace("</ul>", "\n\n").replace("</ol>", "\n\n")
#     raw = raw.replace("<li>", "\n• ").replace("</li>", "")
#     # 모든 태그 제거
#     text = re.sub(r"<[^>]+>", "", raw)
#     # HTML 엔티티 디코드 (&amp; 등)
#     text = htmllib.unescape(text)
#     # 공백 정리
#     text = re.sub(r"[ \t]+\n", "\n", text)
#     text = re.sub(r"\n{3,}", "\n\n", text).strip()
#     # 너무 길면 자르기(원하면 길이 조정)
#     return text[:2000]

# # ----- 유틸: 링크에서 appid 추출 & 이름 조회 -----
# def extract_appid(link: str) -> str | None:
#     m = re.search(r"/app/(\d+)/", link or "")
#     return m.group(1) if m else None

# def get_app_name(appid: str) -> str | None:
#     """store API로 게임 이름 가져오기 (1일 캐시)"""
#     if not appid:
#         return None
#     ck = f"appname_{appid}"
#     cached = _get_cache(ck, 24 * 60 * 60)
#     if cached is not None:
#         return cached
#     try:
#         url = APP_API.format(appid=appid)
#         r = requests.get(url, headers=HEADERS, timeout=8)
#         r.raise_for_status()
#         name = r.json().get(appid, {}).get("data", {}).get("name")
#         _set_cache(ck, name)
#         return name
#     except Exception:
#         _set_cache(ck, None)
#         return None

# def fallback_game_name_from_title(title: str) -> str | None:
#     """[Game] 패턴 또는 'Game - 내용' 패턴으로 게임명 추정 (appid 없을 때 대비)"""
#     if not title:
#         return None
#     m = re.search(r"\[(.*?)\]", title)
#     if m:
#         return m.group(1).strip()
#     parts = title.split(" - ", 1)
#     if len(parts) == 2 and 0 < len(parts[0]) <= 40:
#         return parts[0].strip()
#     return None

# # ----- 뉴스 가져와 카드 포맷으로 정규화 -----
# def fetch_news_all():
#     """Steam 전체 뉴스 RSS → 카드 포맷으로 변환 (10분 캐시)"""
#     ck = "steam_all_news"
#     cached = _get_cache(ck, 10 * 60)
#     if cached is not None:
#         return cached

#     feed = feedparser.parse(RSS_URL)
#     items = []
#     for e in feed.entries[:30]:  # 상위 30개만
#         link = getattr(e, "link", "") or ""
#         title = getattr(e, "title", "") or ""
#         summary_raw = getattr(e, "summary", "") or getattr(e, "description", "") or ""
#         date = getattr(e, "published", None) or getattr(e, "updated", None)

#         # 본문 정리
#         summary = clean_html_to_text(summary_raw)

#         # 게임 이름 계산 (appid가 있으면 우선)
#         appid = extract_appid(link)
#         game_name = get_app_name(appid) if appid else None
#         if not game_name:
#             game_name = fallback_game_name_from_title(title) or "Steam"

#         items.append({
#             "id": link or title,    # 고유 ID
#             "gameName": game_name,  # 카드 상단
#             "title": title,         # 카드 제목
#             "summary": summary,     # 카드 본문(텍스트)
#             "link": link,           # 원문 링크
#             "date": date,           # 문자열 날짜
#             # "appid": appid,       # 필요하면 주석 해제
#         })

#     payload = {"count": len(items), "items": items}
#     _set_cache(ck, payload)
#     return payload

# # ----- API -----
# @app.get("/api/news/all")
# def api_news_all():
#     try:
#         data = fetch_news_all()
#         return jsonify(data)
#     except Exception as e:
#         return jsonify({"error": "fetch_failed", "detail": str(e)}), 502

# # ----- 앱 실행 -----
# if __name__ == "__main__":
#     # http://127.0.0.1:5000/api/news/all
#     app.run(host="127.0.0.1", port=5000, debug=True)




########################################################

# backend/app.py
# from flask import Flask, jsonify
# from flask_cors import CORS
# import requests, re, time, html as htmllib
# import feedparser

# # 번역 & 시간 파싱
# from deep_translator import GoogleTranslator
# from dateutil import parser as dateparser
# from datetime import timezone, timedelta

# app = Flask(__name__)
# CORS(app)

# # ----- 설정 -----
# RSS_URL = "https://store.steampowered.com/feeds/news.xml"
# APP_API = "https://store.steampowered.com/api/appdetails?appids={appid}&l=koreana"

# HEADERS = {
#     "User-Agent": (
#         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
#         "AppleWebKit/537.36 (KHTML, like Gecko) "
#         "Chrome/120.0.0.0 Safari/537.36"
#     ),
#     "Accept-Language": "ko,en;q=0.9",
# }

# # ----- 초간단 메모리 캐시 -----
# _cache = {}

# def _get_cache(key: str, ttl_sec: int):
#     v = _cache.get(key)
#     if not v:
#         return None
#     if time.time() - v["ts"] > ttl_sec:
#         _cache.pop(key, None)
#         return None
#     return v["data"]

# def _set_cache(key: str, data):
#     _cache[key] = {"ts": time.time(), "data": data}

# # ----- 유틸: HTML → 텍스트 정리 -----
# def clean_html_to_text(raw: str) -> str:
#     """RSS summary/description의 HTML을 읽기 좋은 텍스트로 변환"""
#     if not raw:
#         return ""
#     # 줄바꿈/리스트 가독성
#     raw = raw.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
#     raw = raw.replace("</p>", "\n\n").replace("</ul>", "\n\n").replace("</ol>", "\n\n")
#     raw = raw.replace("<li>", "\n• ").replace("</li>", "")
#     # 모든 태그 제거
#     text = re.sub(r"<[^>]+>", "", raw)
#     # 엔티티 디코드 (&amp; 등)
#     text = htmllib.unescape(text)
#     # 공백 정리
#     text = re.sub(r"[ \t]+\n", "\n", text)
#     text = re.sub(r"\n{3,}", "\n\n", text).strip()
#     # 너무 길면 자르기(원하면 길이 조절)
#     return text[:2000]

# # ----- 유틸: 링크에서 appid 추출 & 이름 조회 -----
# def extract_appid(link: str) -> str | None:
#     m = re.search(r"/app/(\d+)/", link or "")
#     return m.group(1) if m else None

# def get_app_name(appid: str) -> str | None:
#     """store API로 게임 이름 가져오기 (1일 캐시)"""
#     if not appid:
#         return None
#     ck = f"appname_{appid}"
#     cached = _get_cache(ck, 24 * 60 * 60)
#     if cached is not None:
#         return cached
#     try:
#         url = APP_API.format(appid=appid)
#         r = requests.get(url, headers=HEADERS, timeout=8)
#         r.raise_for_status()
#         name = r.json().get(appid, {}).get("data", {}).get("name")
#         _set_cache(ck, name)
#         return name
#     except Exception:
#         _set_cache(ck, None)
#         return None

# def fallback_game_name_from_title(title: str) -> str | None:
#     """[Game] 또는 'Game - 내용' 패턴으로 게임명 추정 (appid 없을 때 대비)"""
#     if not title:
#         return None
#     m = re.search(r"\[(.*?)\]", title)
#     if m:
#         return m.group(1).strip()
#     parts = title.split(" - ", 1)
#     if len(parts) == 2 and 0 < len(parts[0]) <= 40:
#         return parts[0].strip()
#     return None

# # ----- 유틸: 날짜를 KST로 보기 좋게 -----
# KST = timezone(timedelta(hours=9))
# def to_kst_str(date_str: str | None) -> str | None:
#     if not date_str:
#         return None
#     try:
#         dt = dateparser.parse(date_str)
#         if not dt.tzinfo:
#             # 타임존 정보가 없으면 UTC로 간주
#             dt = dt.replace(tzinfo=timezone.utc)
#         return dt.astimezone(KST).strftime("%Y-%m-%d %H:%M (KST)")
#     except Exception:
#         return date_str

# # ----- 유틸: 한국어 번역 (deep-translator) -----
# _trans_cache = {}
# def translate_to_ko(text: str) -> str:
#     """간단 캐시 포함 번역. 실패 시 원문 반환."""
#     if not text:
#         return ""
#     key = ("ko", text[:400])
#     if key in _trans_cache:
#         return _trans_cache[key]
#     try:
#         ko = GoogleTranslator(source="auto", target="ko").translate(text)
#         _trans_cache[key] = ko
#         return ko
#     except Exception:
#         return text

# # ----- 뉴스 가져와 카드 포맷으로 정규화 -----
# def fetch_news_all():
#     """Steam 전체 뉴스 RSS → 카드 포맷으로 변환 (10분 캐시)"""
#     ck = "steam_all_news"
#     cached = _get_cache(ck, 10 * 60)
#     if cached is not None:
#         return cached

#     feed = feedparser.parse(RSS_URL)
#     items = []
#     for e in feed.entries[:30]:  # 상위 30개만
#         link = getattr(e, "link", "") or ""
#         title_raw = getattr(e, "title", "") or ""
#         summary_raw = getattr(e, "summary", "") or getattr(e, "description", "") or ""
#         date_raw = getattr(e, "published", None) or getattr(e, "updated", None)

#         # 본문 HTML 정리
#         summary_text = clean_html_to_text(summary_raw)

#         # 번역
#         title_ko = translate_to_ko(title_raw)
#         summary_ko = translate_to_ko(summary_text)

#         # 게임 이름
#         appid = extract_appid(link)
#         game_name = get_app_name(appid) if appid else None
#         if not game_name:
#             game_name = fallback_game_name_from_title(title_raw) or "Steam"

#         # 날짜 KST 포맷
#         date_kst = to_kst_str(date_raw)

#         items.append({
#             "id": link or title_raw,   # 고유 ID
#             "gameName": game_name,     # 카드 상단: 게임 이름
#             "title": title_ko,         # 카드 제목(한국어)
#             "summary": summary_ko,     # 카드 본문(한국어 텍스트)
#             "link": link,              # 원문 링크
#             "date": date_kst,          # "YYYY-MM-DD HH:MM (KST)"
#             # "appid": appid,          # 필요하면 주석 해제
#         })

#     payload = {"count": len(items), "items": items}
#     _set_cache(ck, payload)
#     return payload

# # ----- API -----
# @app.get("/api/news/all")
# def api_news_all():
#     try:
#         data = fetch_news_all()
#         return jsonify(data)
#     except Exception as e:
#         return jsonify({"error": "fetch_failed", "detail": str(e)}), 502

# # ----- 앱 실행 -----
# if __name__ == "__main__":
#     # http://127.0.0.1:5000/api/news/all
#     app.run(host="127.0.0.1", port=5000, debug=True)


##############################################################################


# backend/app.py
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import requests, re, time, html as htmllib
# import feedparser
# from deep_translator import GoogleTranslator
# from dateutil import parser as dateparser
# from datetime import timezone, timedelta

# app = Flask(__name__)
# CORS(app)

# # ===== 설정 =====
# RSS_URL = "https://store.steampowered.com/feeds/news.xml"
# APP_API = "https://store.steampowered.com/api/appdetails?appids={appid}&l=koreana"
# NEWS_API = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/"

# HEADERS = {
#     "User-Agent": (
#         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
#         "AppleWebKit/537.36 (KHTML, like Gecko) "
#         "Chrome/120.0.0.0 Safari/537.36"
#     ),
#     "Accept-Language": "ko,en;q=0.9",
# }

# # ===== 메모리 캐시 =====
# _cache = {}
# def _get_cache(key: str, ttl_sec: int):
#     v = _cache.get(key)
#     if not v: return None
#     if time.time() - v["ts"] > ttl_sec:
#         _cache.pop(key, None); return None
#     return v["data"]
# def _set_cache(key: str, data):
#     _cache[key] = {"ts": time.time(), "data": data}

# # ===== 유틸: HTML -> 텍스트 =====
# def clean_html_to_text(raw: str) -> str:
#     if not raw: return ""
#     raw = raw.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
#     raw = raw.replace("</p>", "\n\n").replace("</ul>", "\n\n").replace("</ol>", "\n\n")
#     raw = raw.replace("<li>", "\n• ").replace("</li>", "")
#     text = re.sub(r"<[^>]+>", "", raw)
#     text = htmllib.unescape(text)
#     text = re.sub(r"[ \t]+\n", "\n", text)
#     text = re.sub(r"\n{3,}", "\n\n", text).strip()
#     return text[:2000]

# # ===== 유틸: 날짜 KST =====
# KST = timezone(timedelta(hours=9))
# def to_kst_str(date_str: str | None) -> str | None:
#     if not date_str: return None
#     try:
#         dt = dateparser.parse(date_str)
#         if not dt.tzinfo:
#             dt = dt.replace(tzinfo=timezone.utc)
#         return dt.astimezone(KST).strftime("%Y-%m-%d %H:%M (KST)")
#     except Exception:
#         return date_str

# # ===== 유틸: 번역 =====
# _trans_cache = {}
# def translate_to_ko(text: str) -> str:
#     if not text: return ""
#     key = ("ko", text[:400])
#     if key in _trans_cache: return _trans_cache[key]
#     try:
#         ko = GoogleTranslator(source="auto", target="ko").translate(text)
#         _trans_cache[key] = ko
#         return ko
#     except Exception:
#         return text

# # ===== 유틸: appid / appname =====
# def extract_appid(link: str) -> str | None:
#     m = re.search(r"/app/(\d+)/", link or "")
#     return m.group(1) if m else None

# def get_app_name(appid: str) -> str | None:
#     if not appid: return None
#     ck = f"appname_{appid}"
#     cached = _get_cache(ck, 24*60*60)
#     if cached is not None: return cached
#     try:
#         r = requests.get(APP_API.format(appid=appid), headers=HEADERS, timeout=8)
#         r.raise_for_status()
#         name = r.json().get(appid, {}).get("data", {}).get("name")
#         _set_cache(ck, name); return name
#     except Exception:
#         _set_cache(ck, None); return None

# def fallback_game_name_from_title(title: str) -> str | None:
#     if not title: return None
#     m = re.search(r"\[(.*?)\]", title)
#     if m: return m.group(1).strip()
#     parts = title.split(" - ", 1)
#     if len(parts)==2 and 0 < len(parts[0]) <= 40:
#         return parts[0].strip()
#     return None

# # ===== 핵심: RSS 텍스트를 requests로 받아서 파싱 =====
# def fetch_rss_entries() -> list:
#     try:
#         resp = requests.get(RSS_URL, headers=HEADERS, timeout=10)
#         resp.raise_for_status()
#         rss_text = resp.text
#         feed = feedparser.parse(rss_text)
#         return list(getattr(feed, "entries", []))
#     except Exception:
#         return []

# # ===== 폴백: 앱별 뉴스 API (예: 440=TF2) =====
# def fetch_app_news(appid: str = "440", count: int = 10) -> list:
#     try:
#         params = {"appid": appid, "count": count, "maxlength": 0, "format": "json"}
#         r = requests.get(NEWS_API, params=params, headers=HEADERS, timeout=8)
#         r.raise_for_status()
#         items = r.json().get("appnews", {}).get("newsitems", []) or []
#         out = []
#         name = get_app_name(appid) or "Steam"
#         for n in items:
#             title_raw = n.get("title", "") or ""
#             contents_raw = n.get("contents", "") or ""
#             link = n.get("url", "") or ""
#             date_unix = n.get("date")
#             date_str = None
#             if isinstance(date_unix, (int, float)):
#                 # unix -> KST
#                 date_str = to_kst_str(time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(date_unix)))

#             summary_text = clean_html_to_text(contents_raw)
#             out.append({
#                 "id": n.get("gid") or link or title_raw,
#                 "gameName": name,
#                 "title": translate_to_ko(title_raw),
#                 "summary": translate_to_ko(summary_text),
#                 "link": link,
#                 "date": date_str,
#             })
#         return out
#     except Exception:
#         return []

# # ===== 전체 뉴스: RSS 우선, 실패/빈값이면 폴백 =====
# def fetch_news_all():
#     ck = "steam_all_news"
#     cached = _get_cache(ck, 10*60)
#     if cached is not None:
#         return cached

#     items = []
#     entries = fetch_rss_entries()
#     if entries:
#         for e in entries[:30]:
#             link = getattr(e, "link", "") or ""
#             title_raw = getattr(e, "title", "") or ""
#             summary_raw = getattr(e, "summary", "") or getattr(e, "description", "") or ""
#             date_raw = getattr(e, "published", None) or getattr(e, "updated", None)

#             summary_text = clean_html_to_text(summary_raw)
#             title_ko = translate_to_ko(title_raw)
#             summary_ko = translate_to_ko(summary_text)

#             appid = extract_appid(link)
#             game_name = get_app_name(appid) if appid else None
#             if not game_name:
#                 game_name = fallback_game_name_from_title(title_raw) or "Steam"

#             items.append({
#                 "id": link or title_raw,
#                 "gameName": game_name,
#                 "title": title_ko,
#                 "summary": summary_ko,
#                 "link": link,
#                 "date": to_kst_str(date_raw),
#             })

#     # RSS가 비거나 막히면 앱 뉴스로 폴백 (TF2=440 예시)
#     if not items:
#         items = fetch_app_news(appid="440", count=10)

#     payload = {"count": len(items), "items": items}
#     _set_cache(ck, payload)
#     return payload

# # ===== API =====
# @app.get("/api/news/all")
# def api_news_all():
#     data = fetch_news_all()
#     return jsonify(data)

# # 앱별 뉴스 바로 보기 (테스트용): /api/news/app?appid=570
# @app.get("/api/news/app")
# def api_news_app():
#     appid = request.args.get("appid", "570").strip()
#     items = fetch_app_news(appid=appid, count=10)
#     return jsonify({"appid": appid, "count": len(items), "items": items})

# if __name__ == "__main__":
#     # http://127.0.0.1:5000/api/news/all
#     # http://127.0.0.1:5000/api/news/app?appid=570
#     app.run(host="127.0.0.1", port=5000, debug=True)
#############################################################


# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests, re, time, html as htmllib
import feedparser
from deep_translator import GoogleTranslator
from dateutil import parser as dateparser
from datetime import timezone, timedelta

app = Flask(__name__)
CORS(app)

# ===== 설정 =====
RSS_URL = "https://store.steampowered.com/feeds/news.xml"
APP_API = "https://store.steampowered.com/api/appdetails?appids={appid}&l=koreana"
NEWS_API = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ko,en;q=0.9",
}

# ===== 메모리 캐시 =====
_cache = {}
def _get_cache(key: str, ttl_sec: int):
    v = _cache.get(key)
    if not v: return None
    if time.time() - v["ts"] > ttl_sec:
        _cache.pop(key, None); return None
    return v["data"]
def _set_cache(key: str, data):
    _cache[key] = {"ts": time.time(), "data": data}

# ===== 유틸: HTML -> 텍스트 =====
def clean_html_to_text(raw: str) -> str:
    if not raw: return ""
    raw = raw.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
    raw = raw.replace("</p>", "\n\n").replace("</ul>", "\n\n").replace("</ol>", "\n\n")
    raw = raw.replace("<li>", "\n• ").replace("</li>", "")
    text = re.sub(r"<[^>]+>", "", raw)
    text = htmllib.unescape(text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text[:2000]

# ===== 유틸: HTML에서 첫 이미지/유튜브 뽑기 =====
IMG_RE = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
YOUTUBE_RE = re.compile(
    r'(https?://(?:www\.)?(?:youtube\.com/watch\?v=[\w\-]+|youtu\.be/[\w\-]+))',
    re.I,
)

def extract_first_image(html: str) -> str | None:
    if not html: return None
    m = IMG_RE.search(html)
    return m.group(1) if m else None

def extract_youtube_link(html: str) -> str | None:
    if not html: return None
    m = YOUTUBE_RE.search(html)
    return m.group(1) if m else None

def youtube_to_embed(url: str) -> str:
    # watch?v=abcd -> embed/abcd, youtu.be/abcd -> embed/abcd
    if "watch?v=" in url:
        vid = url.split("watch?v=")[-1].split("&")[0]
        return f"https://www.youtube.com/embed/{vid}"
    if "youtu.be/" in url:
        vid = url.split("youtu.be/")[-1].split("?")[0]
        return f"https://www.youtube.com/embed/{vid}"
    return url

# ===== 유틸: 날짜 KST =====
KST = timezone(timedelta(hours=9))
def to_kst_str(date_str: str | None) -> str | None:
    if not date_str: return None
    try:
        dt = dateparser.parse(date_str)
        if not dt.tzinfo:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(KST).strftime("%Y-%m-%d %H:%M (KST)")
    except Exception:
        return date_str

# ===== 유틸: 번역 =====
_trans_cache = {}
def translate_to_ko(text: str) -> str:
    if not text: return ""
    key = ("ko", text[:400])
    if key in _trans_cache: return _trans_cache[key]
    try:
        ko = GoogleTranslator(source="auto", target="ko").translate(text)
        _trans_cache[key] = ko
        return ko
    except Exception:
        return text

# ===== 유틸: appid / appname / 이미지 후보 =====
def extract_appid(link: str) -> str | None:
    m = re.search(r"/app/(\d+)/", link or "")
    return m.group(1) if m else None

def get_app_name(appid: str) -> str | None:
    if not appid: return None
    ck = f"appname_{appid}"
    cached = _get_cache(ck, 24*60*60)
    if cached is not None: return cached
    try:
        r = requests.get(APP_API.format(appid=appid), headers=HEADERS, timeout=8)
        r.raise_for_status()
        name = r.json().get(appid, {}).get("data", {}).get("name")
        _set_cache(ck, name); return name
    except Exception:
        _set_cache(ck, None); return None

def app_header_image(appid: str | None) -> str | None:
    if not appid: return None
    # 스팀 앱 공용 헤더 이미지(가장 무난)
    return f"https://cdn.akamai.steamstatic.com/steam/apps/{appid}/header.jpg"

def best_media(html_raw: str, appid: str | None):
    """요약 HTML에서 이미지/유튜브 시도 → 없으면 appid로 헤더 이미지"""
    img = extract_first_image(html_raw)
    yt = extract_youtube_link(html_raw)
    embed = youtube_to_embed(yt) if yt else None
    if not img:
        img = app_header_image(appid)
    return img, embed

# ===== 핵심: RSS를 requests로 받아 파싱 =====
def fetch_rss_entries() -> list:
    try:
        resp = requests.get(RSS_URL, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        rss_text = resp.text
        feed = feedparser.parse(rss_text)
        return list(getattr(feed, "entries", []))
    except Exception:
        return []

# ===== 폴백: 앱별 뉴스 API =====
def fetch_app_news(appid: str = "440", count: int = 10) -> list:
    try:
        params = {"appid": appid, "count": count, "maxlength": 0, "format": "json"}
        r = requests.get(NEWS_API, params=params, headers=HEADERS, timeout=8)
        r.raise_for_status()
        items = r.json().get("appnews", {}).get("newsitems", []) or []
        out = []
        name = get_app_name(appid) or "Steam"
        for n in items:
            title_raw = n.get("title", "") or ""
            contents_raw = n.get("contents", "") or ""
            link = n.get("url", "") or ""
            date_unix = n.get("date")
            date_str = None
            if isinstance(date_unix, (int, float)):
                date_str = to_kst_str(time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(date_unix)))

            # 미디어
            img, yt = best_media(contents_raw, appid)

            # 본문 정리/번역
            summary_text = clean_html_to_text(contents_raw)
            out.append({
                "id": n.get("gid") or link or title_raw,
                "gameName": name,
                "title": translate_to_ko(title_raw),
                "summary": translate_to_ko(summary_text),
                "link": link,
                "date": date_str,
                "image": img,
                "video": yt,
            })
        return out
    except Exception:
        return []

# ===== 전체 뉴스: RSS 우선, 실패/빈값이면 폴백 =====
def fetch_news_all():
    ck = "steam_all_news"
    cached = _get_cache(ck, 10*60)
    if cached is not None:
        return cached

    items = []
    entries = fetch_rss_entries()
    if entries:
        for e in entries[:30]:
            link = getattr(e, "link", "") or ""
            title_raw = getattr(e, "title", "") or ""
            summary_raw = getattr(e, "summary", "") or getattr(e, "description", "") or ""
            date_raw = getattr(e, "published", None) or getattr(e, "updated", None)
            appid = extract_appid(link)

            # 미디어 먼저
            img, yt = best_media(summary_raw, appid)

            # 본문 정리/번역
            summary_text = clean_html_to_text(summary_raw)
            title_ko = translate_to_ko(title_raw)
            summary_ko = translate_to_ko(summary_text)

            game_name = get_app_name(appid) if appid else None
            if not game_name:
                # 제목에서 추정
                m = re.search(r"\[(.*?)\]", title_raw)
                game_name = (m.group(1).strip() if m else None) or "Steam"

            items.append({
                "id": link or title_raw,
                "gameName": game_name,
                "title": title_ko,
                "summary": summary_ko,
                "link": link,
                "date": to_kst_str(date_raw),
                "image": img,
                "video": yt,
            })

    if not items:
        # 예: TF2(440) 폴백
        items = fetch_app_news(appid="440", count=10)

    payload = {"count": len(items), "items": items}
    _set_cache(ck, payload)
    return payload

# ===== API =====
@app.get("/api/news/all")
def api_news_all():
    data = fetch_news_all()
    return jsonify(data)

@app.get("/api/news/app")
def api_news_app():
    appid = request.args.get("appid", "570").strip()
    items = fetch_app_news(appid=appid, count=10)
    return jsonify({"appid": appid, "count": len(items), "items": items})

if __name__ == "__main__":
    # http://127.0.0.1:5000/api/news/all
    # http://127.0.0.1:5000/api/news/app?appid=570
    app.run(host="127.0.0.1", port=5000, debug=True)
