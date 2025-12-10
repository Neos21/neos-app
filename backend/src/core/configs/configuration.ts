import * as path from 'node:path';

/**
 * 環境変数より文字列値を取得する・環境変数が存在しなければデフォルト値を使用する
 * 
 * @param envName 環境変数名
 * @param defaultValue デフォルト値
 * @return 値
 */
const getStringValue = (envName: string, defaultValue: string): string => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getStringValue()  : Env [${envName}] Is Empty. Use Default Value [${defaultValue}]`);
    return defaultValue;
  }
  const stringValue = process.env[envName]!;
  console.log(`configuration#getStringValue()  : Env [${envName}] = [${stringValue}]`);
  return stringValue;
};

/**
 * 環境変数より値を取得し数値型で返す・環境変数が存在しないか数値型に変換できない場合はデフォルト値を使用する
 * 
 * @param envName 環境変数名
 * @param defaultValue デフォルト値
 * @return 値
 */
const getNumberValue = (envName: string, defaultValue: number): number => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getNumberValue()  : Env [${envName}] Is Empty. Use Default Value [${defaultValue}]`);
    return defaultValue;
  }
  const rawValue = process.env[envName]!;
  const numberValue = Number(rawValue);
  if(Number.isNaN(numberValue)) {
    console.log(`configuration#getNumberValue()  : Env [${envName}] Value Is NaN [${rawValue}]. Use Default Value [${defaultValue}]`);
    return defaultValue;
  }
  console.log(`configuration#getNumberValue()  : Env [${envName}] = [${numberValue}]`);
  return numberValue;
};

/**
 * 環境変数より値が設定されているか否かで Boolean 値を返す
 * 
 * @param envName 環境変数名
 * @return 当該環境変数に何らかの値が設定されていれば `true`・未定義であれば `false`
 */
const getBooleanValue = (envName: string): boolean => {
  const isTruthy = process.env[envName] != null;
  console.log(`configuration#getBooleanValue() : Env [${envName}] = [${isTruthy}]`);
  return isTruthy;
};

/** 環境変数のオブジェクトを返す : この関数内にオブジェクトを定義しないと環境変数が読み込まれない */
export const configuration = (): { [key: string]: string | number | boolean } => ({
  port                : getNumberValue ('NEOS_APP_PORT'                  , 2121                             ),  // ポート番号
  userName            : getStringValue ('NEOS_APP_USERNAME'              , 'CHANGE-THIS'                    ),  // ユーザ名
  password            : getStringValue ('NEOS_APP_PASSWORD'              , 'CHANGE-THIS'                    ),  // パスワード
  jwtSecretKey        : getStringValue ('NEOS_APP_JWT_SECRET_KEY'        , 'JWT-SECRET-KEY'                 ),  // JWT 秘密鍵
  jwtExpiresIn        : getStringValue ('NEOS_APP_JWT_EXPIRES_IN'        , '1y'                             ),  // JWT 有効期限
  staticDirectoryPath : getStringValue ('NEOS_APP_STATIC_DIRECTORY_PATH' , path.resolve(__dirname, '../../../../frontend/dist'         )),  // 静的ファイルのディレクトリ
  dbFilePath          : getStringValue ('NEOS_APP_DB_FILE_PATH'          , path.resolve(__dirname, '../../../../db/neos-app.sqlite3.db')),  // DB ファイルパス
  
  dbDirectoryPath     : getStringValue ('NEOS_APP_DB_DIRECTORY_PATH'     , path.resolve(__dirname, '../../../../db'        )),  // DB ディレクトリパス
  jsonDbDirectoryPath : getStringValue ('NEOS_APP_JSON_DB_DIRECTORY_PATH', path.resolve(__dirname, '../../../../db/json-db')),  // JSON DB 用のディレクトリ
  sqliteDirectoryPath : getStringValue ('NEOS_APP_SQLITE_DIRECTORY_PATH' , path.resolve(__dirname, '../../../../db/sqlite' )),  // SQLite 用のディレクトリ
  pvDirectoryPath     : getStringValue ('NEOS_APP_PV_DIRECTORY_PATH'     , path.resolve(__dirname, '../../../../pv'        )),  // PV カウンタによるアクセスログ保存用のディレクトリ
  
  amazonAccessKey     : getStringValue ('NEOS_APP_AMAZON_ACCESS_KEY'     , ''                               ),  // Amazon PA API アクセスキー
  amazonSecretKey     : getStringValue ('NEOS_APP_AMAZON_SECRET_KEY'     , ''                               ),  // Amazon PA API シークレットキー
  amazonPartnerTag    : getStringValue ('NEOS_APP_AMAZON_PARTNER_TAG'    , 'neos21-22'                      ),  // Amazon PA API パートナータグ
  rakutenApplicationId: getStringValue ('NEOS_APP_RAKUTEN_APPLICATION_ID', ''                               ),  // Rakuten Application ID
  rakutenAffiliateId  : getStringValue ('NEOS_APP_RAKUTEN_AFFILIATE_ID'  , ''                               ),  // Rakuten Affiliate ID
  
  solilogDirectoryPath: getStringValue ('NEOS_APP_SOLILOG_DIRECTORY_PATH', '/var/www/private/solilog'       ),  // Solilog JSON ファイルのディレクトリ
  fileDirectoryPath   : getStringValue ('NEOS_APP_FILE_DIRECTORY_PATH'   , '/var/www/private/file-uploader' ),  // ファイルアップローダのディレクトリ
  mediaDirectoryPath  : getStringValue ('NEOS_APP_MEDIA_DIRECTORY_PATH'  , '/var/www/private/media-explorer'),  // Media Explorer のディレクトリ (配下の `public/` を参照する)
  
  noColour            : getBooleanValue('NO_COLOR'                                                          )   // ロガーの色付けをしない : NestJS のロガー `cli-colors.util.js` と同じ環境変数名・確認のため宣言
});
