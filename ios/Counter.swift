//
//  Counter.swift
//  VideoTest
//
//  Created by Wunna on 3/30/23.
//
import Foundation
import CryptoSwift
import BMHCrypto


@objc(Counter)
class Counter:NSObject {
  private var count = 0;

  // @objc func increment(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
  //     count += 1;
  //     print("increase count", count)
  // }

  @objc func increment(_ sourceFile: URL, desFile: URL, key: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
//      resolve("You sent email '\(email)', password '\(password)'")
    
    
    do {
      print("source file :", sourceFile, "desFile :", desFile, "key: ", key)
//       let videoUrl = sourceFile
      let data = try Data(contentsOf: sourceFile)
       let decrypted = try decryptChunk(encryptedData: data, key: key, iv: data.prefix(16).byteArray)
       try decrypted.write(to: desFile)
       resolve("File Decrypt Successful")
    } catch {
      reject("event_failure", "no event id returned", nil);
    }
    }
  
  
  @objc func decryptChunk(encryptedData: Data, key: String, iv: Array<UInt8>) throws -> Data {
     let newString = encryptedData.byteArray[16..<encryptedData.byteArray.count]
      let decryptedData = try! newString.byteArray.decrypt(cipher: AES(key: key.bytes, blockMode: CTR(iv: iv), padding: .noPadding))
     return Data(decryptedData)
 }
  
    @objc
  static func requiresMainQueueSetUp() -> Bool {
    return true;
  }
    
}
