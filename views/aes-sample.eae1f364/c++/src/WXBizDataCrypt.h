
#pragma once

#include <string>
#include <stdint.h>

namespace WxBizDataSecure {

static const unsigned int kAesKeySize = 16;
static const unsigned int kAesIVSize = 16;
static const unsigned int kEncodingKeySize = 24;
static const unsigned int kMaxBase64Size = 1000000000;
enum  WxBizDataCryptErrorCode
{
    WXBizDataCrypt_OK = 0,
    WXBizDataCrypt_IllegalAesKey = -41001,
    WXBizDataCrypt_IllegalIv = -41002,
    WXBizDataCrypt_IllegalBuffer = -41003,
    WXBizDataCrypt_DecodeBase64_Error = -41004,
};

class WXBizDataCrypt
{
public:
    //构造函数
    // @param sSessionKey: 
    // @param sAppid: 

    WXBizDataCrypt( const std::string &sAppid,
					const std::string &sSessionkey )
					:m_sAppid(sAppid) ,m_sSessionkey(sSessionkey) 
					{   }
    
    
    // 检验数据的真实性，并且获取解密后的明文
    // @param sEncryptedData: 
    // @param sIv: 
    // @param sData: 
    // @return: 成功0，失败返回对应的错误码
    int DecryptData(
			const std::string &sEncryptedData,
			const std::string &sIv,
			std::string &sData);

    private:
    std::string m_sAppid;
    std::string m_sSessionkey;

private:
    int AES_CBCDecrypt( const char * sSource, const uint32_t iSize,
            const char * sKey, uint32_t iKeySize, 
			const char * sIv, uint32_t iIvSize,
			std::string * poResult );
    
    int AES_CBCDecrypt( const std::string & objSource,
            const std::string & objKey, const std::string & sIv, 
			std::string * poResult );
    
    //base64
    int DecodeBase64(const std::string sSrc, std::string & sTarget);
    
};

}

