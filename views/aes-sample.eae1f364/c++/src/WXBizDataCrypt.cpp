#include "WXBizDataCrypt.h"

#include <string.h>
#include <stdlib.h>
#include <arpa/inet.h>
#include <string>
#include <vector>
#include <algorithm>
#include <iostream>

#include "openssl/aes.h"
#include "openssl/sha.h"
#include "openssl/evp.h"
#include "rapidjson/document.h"


#define FREE_PTR(ptr) \
    if (NULL != (ptr)) {\
        free (ptr);\
        (ptr) = NULL;\
    }

#define DELETE_PTR(ptr) \
    if (NULL != (ptr)) {\
        delete (ptr);\
        (ptr) = NULL;\
    }
    
namespace WxBizDataSecure{

int WXBizDataCrypt :: DecryptData(
			const std::string &sEncryptedData,
			const std::string &sIv,
			std::string &sData)
{
	std::string result;
    //1.decode base64 for sessionkey , iv and encryptedData
    std::string sAesData;
    if(0 != DecodeBase64( sEncryptedData, sAesData ))
    {
        return WXBizDataCrypt_DecodeBase64_Error;
    }
    
    std::string sAesKey;
    if(0 != DecodeBase64(m_sSessionkey,sAesKey)) 
    {
        return WXBizDataCrypt_IllegalAesKey;
    }

	std::string sAesIv;
	if(0 != DecodeBase64(sIv, sAesIv)) 
    {
        return WXBizDataCrypt_IllegalIv;
    }

    //2.decode aes
    if(0 != AES_CBCDecrypt(sAesData, sAesKey, sAesIv, &result))
    {
        return WXBizDataCrypt_IllegalBuffer;
    }


	// 3. check appid
	rapidjson::Document tJsonDoc;
	if( tJsonDoc.Parse < 0 > ( result.c_str() ).HasParseError() || tJsonDoc.IsObject() == false )
	{
        return WXBizDataCrypt_IllegalBuffer;
	}

	if( tJsonDoc.HasMember( "watermark" ) == false || tJsonDoc["watermark"].IsObject() == false  )
	{
        return WXBizDataCrypt_IllegalBuffer;
	}

	rapidjson::Value & tWaterMarkDoc = tJsonDoc["watermark"];
	if( tWaterMarkDoc.HasMember( "appid" ) == false || tWaterMarkDoc["appid"].IsString() == false )
	{
        return WXBizDataCrypt_IllegalBuffer;
	}
	if( tWaterMarkDoc["appid"].GetString() != m_sAppid )
	{
        return WXBizDataCrypt_IllegalBuffer;
	}

	sData = result;
    return WXBizDataCrypt_OK;
}


int WXBizDataCrypt::AES_CBCDecrypt( const std::string & objSource,
        const std::string & objKey, const std::string & sIv,
		std::string * poResult )
{
    return AES_CBCDecrypt( objSource.data(), objSource.size(),
            objKey.data(), objKey.size(), 
			sIv.c_str(), sIv.size(),
			poResult );
}

int WXBizDataCrypt::AES_CBCDecrypt( const char * sSource, const uint32_t iSize,
        const char * sKey, uint32_t iKeySize, 
		const char * sIv, uint32_t iIvSize,
		std::string * poResult )
{
    if ( !sSource || !sKey || iSize < kAesKeySize || iSize % kAesKeySize != 0 || !poResult)
    {
        return -1;
    }
    
    poResult->clear();

    unsigned char * out = (unsigned char*)malloc( iSize );
    if(NULL == out)
    {
        return -1;
    }

    unsigned char key[ kAesKeySize ] = { 0 };
    unsigned char iv[ kAesIVSize ] = {0} ;
    memcpy( key, sKey, iKeySize > kAesKeySize ? kAesKeySize : iKeySize );
    memcpy(iv, sIv, iIvSize > kAesIVSize ? kAesIVSize : iIvSize );

    int iReturnValue = 0;
    AES_KEY aesKey;
    AES_set_decrypt_key( key, 8 * kAesKeySize, &aesKey );
    AES_cbc_encrypt( (unsigned char *)sSource, out, iSize, &aesKey, iv ,AES_DECRYPT);
    if( out[iSize-1] > 0 && out[iSize-1] <= kAesKeySize && (iSize - out[iSize-1]) > 0 )
    {
        poResult->append( (char *)out , iSize - out[iSize-1] );
    } else {
        iReturnValue = -1;
    }

    FREE_PTR(out);
    return iReturnValue;
}

int WXBizDataCrypt::DecodeBase64(const std::string sSrc, std::string & sTarget)
{
    if(0 == sSrc.size() || kMaxBase64Size < sSrc.size())
    {
        return -1;
    }
    
    //¼ÆËãÄ©Î²=ºÅ¸öÊý
    int iEqualNum = 0;
    for(int n= sSrc.size() - 1; n>=0; --n)
    {
        if(sSrc.c_str()[n] == '=')
        {
            iEqualNum++;
        }
        else
        {
            break;
        }
    }
    
    int iOutBufSize = sSrc.size();
    char * pcOutBuf = (char*)malloc( iOutBufSize);
    if(NULL == pcOutBuf)
    {
        return -1;
    }
    
    int iRet = 0;
    int iTargetSize = 0;
    iTargetSize =  EVP_DecodeBlock((unsigned char*)pcOutBuf, (const unsigned char*)sSrc.c_str(), sSrc.size());
    if(iTargetSize > iEqualNum && iTargetSize < iOutBufSize)
    {
        sTarget.assign(pcOutBuf, iTargetSize - iEqualNum);
    }
    else
    {
        iRet = -1;
    }
    
    FREE_PTR(pcOutBuf);
    return iRet;
}



}


