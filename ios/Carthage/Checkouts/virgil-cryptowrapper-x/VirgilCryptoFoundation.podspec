Pod::Spec.new do |s|
  s.name                        = "VirgilCryptoFoundation"
  s.version                     = "0.16.3"
  s.swift_version               = "5.0"
  s.license                     = { :type => "BSD", :file => "LICENSE" }
  s.summary                     = "Contains basic swift classes for creating key pairs, encrypting/decrypting data, signing data and verifying signatures."
  s.homepage                    = "https://github.com/VirgilSecurity/virgil-cryptowrapper-x"
  s.authors                     = { "Virgil Security" => "https://virgilsecurity.com/" }
  s.source                      = { :git => "https://github.com/VirgilSecurity/virgil-cryptowrapper-x.git", :tag => s.version }
  s.ios.deployment_target       = "11.0"
  s.osx.deployment_target       = "10.9"
  s.tvos.deployment_target      = "11.0"
  s.watchos.deployment_target   = "4.0"
  s.public_header_files         = "VirgilCryptoFoundation/VirgilCryptoFoundation.h"
  s.source_files                = "VirgilCryptoFoundation/**/*.{h,mm,swift}"
  s.dependency 'VSCCrypto/Common', '= 0.16.3'
  s.dependency 'VSCCrypto/Foundation', '= 0.16.3'
end
