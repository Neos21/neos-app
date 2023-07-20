/**
 * 環境変数より文字列値を取得する・環境変数が存在しなければデフォルト値を使用する
 * 
 * @param envName 環境変数名
 * @param defaultValue デフォルト値
 * @return 値
 */
const getStringValue = (envName: string, defaultValue: string): string => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getStringValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
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
    console.log(`configuration#getNumberValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const rawValue = process.env[envName]!;
  const numberValue = Number(rawValue);
  if(Number.isNaN(numberValue)) {
    console.log(`configuration#getNumberValue()  : Env [${envName}] value is NaN [${rawValue}]. Use default value [${defaultValue}]`);
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
  port                : getNumberValue ('PORT'                  , 2121            ),  // ポート番号
  userName            : getStringValue ('USERNAME'              , 'CHANGE-THIS'   ),  // ユーザ名
  password            : getStringValue ('PASSWORD'              , 'CHANGE-THIS'   ),  // パスワード
  jwtSecretKey        : getStringValue ('JWT_SECRET_KEY'        , 'JWT-SECRET-KEY'),  // JWT 秘密鍵
  jwtExpiresIn        : getStringValue ('JWT_EXPIRES_IN'        , '1y'            ),  // JWT 有効期限
  dbFilePath          : getStringValue ('DB_FILE_PATH'          , ''              ),  // DB ファイルパス : 未指定の場合は `app.module.ts` 内で初期値を設定する
  staticDirectoryPath : getStringValue ('STATIC_DIRECTORY_PATH' , ''              ),  // 静的ファイルのディレクトリ : 未指定の場合は `app.module.ts` 内で初期値を設定する
  amazonAccessKey     : getStringValue ('AMAZON_ACCESS_KEY'     , ''              ),  // Amazon PA API アクセスキー
  amazonSecretKey     : getStringValue ('AMAZON_SECRET_KEY'     , ''              ),  // Amazon PA API シークレットキー
  amazonPartnerTag    : getStringValue ('AMAZON_PARTNER_TAG'    , 'neos21-22'     ),  // Amazon PA API パートナータグ
  rakutenApplicationId: getStringValue ('RAKUTEN_APPLICATION_ID', ''              ),  // Rakuten Application ID
  rakutenAffiliateId  : getStringValue ('RAKUTEN_AFFILIATE_ID'  , ''              ),  // Rakuten Affiliate ID
  noColour            : getBooleanValue('NO_COLOR'                                ),  // ロガーの色付けをしない : NestJS のロガー `cli-colors.util.js` と同じ環境変数名・確認のため宣言
});
