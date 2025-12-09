import requests
import os
from dotenv import load_dotenv
load_dotenv()

# --- 設定パラメータ ---
# TODO: 自分のGoogle Maps Platform APIキーに置き換えてください
API_KEY =os.environ.get("API_KEY")

# ユーザーから提供された JSON データから抽出した photo_reference
PHOTO_REFERENCE = "AWn5SU4z4AgxqmL2HQZ7jaxzaUoN9HEe1Wfoi_MCoHzxA2tHpzkprhne3GG2T1v_XDdfeHqjkWeVz2bXw04XzPOCEGIYfAkwf5Hyc43kg1sTtj6KQ4OCs9TEh9yXAQGgB3FCrI9u8VKvVjnDcXYeUC6qpw_FxZgv-4I6OS1bIr0u-v7-HDq2URGGlJm3x6L63KPSRqtoC73YwhbCUsh9hGwESO5_0zfe6li5yaAD3BvqXiJIvq_4W52qOVfY4nKwxIXthHAuDpeqcwLIRk6iIhSoSoIscPXrNRfoDNhHiEDM_gLB3sPQx_2LUmeI89pGJW81O4mK3FTurOI"

# 画像の最大幅を指定 (4032pxまで指定可能ですが、ここでは400pxにリサイズします)
MAX_WIDTH = 400

# 保存するファイル名
OUTPUT_FILENAME = "map_photo_400px.jpg"

# Google Place Photos API のエンドポイント
API_URL = "https://maps.googleapis.com/maps/api/place/photo"

# --- リクエストの構築と実行 ---

params = {
    "maxwidth": MAX_WIDTH,
    "photoreference": PHOTO_REFERENCE,
    "key": API_KEY
}

print(f"APIリクエストを開始します: {API_URL}")

try:
    # APIにGETリクエストを送信
    response = requests.get(API_URL, params=params, stream=True)
    
    # レスポンスのステータスコードを確認
    if response.status_code == 200:
        # 画像データをファイルに書き込み
        with open(OUTPUT_FILENAME, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        
        print(f"✅ 画像のダウンロードが完了しました。ファイル名: {os.path.abspath(OUTPUT_FILENAME)}")
    else:
        # エラー処理
        print(f"❌ 画像の取得に失敗しました。ステータスコード: {response.status_code}")
        # APIがエラーメッセージをJSONで返す場合があるため、テキストも表示
        print(f"レスポンステキスト:\n{response.text}")
        
except requests.exceptions.RequestException as e:
    print(f"🚨 リクエスト中にエラーが発生しました: {e}")