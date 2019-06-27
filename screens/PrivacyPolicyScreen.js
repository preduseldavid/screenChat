import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  ImageBackground,
  Linking,
} from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/HeaderCustom';

export default class PrivacyPolicyScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollToEndVisible: false,
      scrollToEndfunctionStarted: false,
    };

    this.goBack = this.goBack.bind(this);

    this.contentScrollView;
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      scrollToEndVisible: true,
      scrollToEndfunctionStarted: true }), 3000);
  }

  scrollToEnd = () => {
    this.contentScrollView.scrollToEnd({
      animated: true,
    });
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 60;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  }

  toggleScrollToEnd = (nativeEvent) => {
    if (this.isCloseToBottom(nativeEvent))
      this.setState({ scrollToEndVisible: false });
    else
      this.setState({ scrollToEndVisible: true });
  }

  goBack() {
    this.props.navigation.goBack(null);
  }

  render() {

    var header, agreeButton;
    if (this.props.noBack == null) {
      header =
        <Header
          title={'Privacy Policy'}
          goBack={this.goBack}
        />;
    }

    return (
      <View style={styles.mainContainer}>
        {header}
        <ScrollView
          ref={view => this.contentScrollView = view}
          style={styles.container}
          onScroll={({ nativeEvent }) => this.toggleScrollToEnd(nativeEvent)}
        >
          <Image style={styles.logo} source={require('../assets/images/logo-1024.png')} />

          <Text style={styles.title}>Privacy policy</Text>

          <Text style={styles.contentText}>        This privacy policy (&quot;Policy&quot;) describes how Mobile Application Developer (&quot;Mobile Application Developer&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) collects, protects and uses the personally identifiable information (&quot;Personal Information&quot;) you (&quot;User&quot;, &quot;you&quot; or &quot;your&quot;) may provide in the Screen Chat mobile application and any of its products or services (collectively, &quot;Mobile Application&quot; or &quot;Services&quot;). It also describes the choices available to you regarding our use of your Personal Information and how you can access and update this information. This Policy does not apply to the practices of companies that we do not own or control, or to individuals that we do not employ or manage.</Text>

          <Text style={styles.subtitle}>Collection of personal information</Text>

          <Text style={styles.contentText}>        We receive and store any information you knowingly provide to us when you publish content, fill any online forms in the Mobile Application.  You can choose not to provide us with certain information, but then you may not be able to take advantage of some of the Mobile Application's features. Users who are uncertain about what information is mandatory are welcome to contact us.</Text>

          <Text style={styles.subtitle}>Collection of non-personal information</Text>

          <Text style={styles.contentText}>        When you open the Mobile Application our servers automatically record information that your device sends. This data may include information such as your device's IP address and location, device name and version, operating system type and version, language preferences, information you search for in our Mobile Application, access times and dates, and other statistics.</Text>

          <Text style={styles.subtitle}>Use and processing of collected information</Text>

          <Text style={styles.contentText}>        Any of the information we collect from you may be used to personalize your experience; improve our Mobile Application; improve customer service and respond to queries and emails of our customers; run and operate our Mobile Application and Services. Non-Personal Information collected is used only to identify potential cases of abuse and establish statistical information regarding Mobile Application traffic and usage. This statistical information is not otherwise aggregated in such a way that would identify any particular user of the system.</Text>

          <Text style={styles.contentText}>        We may process Personal Information related to you if one of the following applies: (i) You have given your consent for one or more specific purposes. Note that under some legislations we may be allowed to process information until you object to such processing (by opting out), without having to rely on consent or any other of the following legal bases below. This, however, does not apply, whenever the processing of Personal Information is subject to European data protection law; (ii) Provision of information is necessary for the performance of an agreement with you and/or for any pre-contractual obligations thereof; (ii) Processing is necessary for compliance with a legal obligation to which you are subject; (iv) Processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in us; (v) Processing is necessary for the purposes of the legitimate interests pursued by us or by a third party. In any case, we will be happy to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.</Text>

          <Text style={styles.subtitle}>Information transfer and storage</Text>

          <Text style={styles.contentText}>        Depending on your location, data transfers may involve transferring and storing your information in a country other than your own. You are entitled to learn about the legal basis of information transfers to a country outside the European Union or to any international organization governed by public international law or set up by two or more countries, such as the UN, and about the security measures taken by us to safeguard your information. If any such transfer takes place, you can find out more by checking the relevant sections of this document or inquire with us using the information provided in the contact section.</Text>

          <Text style={styles.subtitle}>The rights of users</Text>

          <Text style={styles.contentText}>        You may exercise certain rights regarding your information processed by us. In particular, you have the right to do the following: (i) you have the right to withdraw consent where you have previously given your consent to the processing of your information; (ii) you have the right to object to the processing of your information if the processing is carried out on a legal basis other than consent; (iii) you have the right to learn if information is being processed by us, obtain disclosure regarding certain aspects of the processing and obtain a copy of the information undergoing processing; (iv) you have the right to verify the accuracy of your information and ask for it to be updated or corrected; (v) you have the right, under certain circumstances, to restrict the processing of your information, in which case, we will not process your information for any purpose other than storing it; (vi) you have the right, under certain circumstances, to obtain the erasure of your Personal Information from us; (vii) you have the right to receive your information in a structured, commonly used and machine readable format and, if technically feasible, to have it transmitted to another controller without any hindrance. This provision is applicable provided that your information is processed by automated means and that the processing is based on your consent, on a contract which you are part of or on pre-contractual obligations thereof.</Text>

          <Text style={styles.subtitle}>The right to object to processing</Text>

          <Text style={styles.contentText}>        Where Personal Information is processed for the public interest, in the exercise of an official authority vested in us or for the purposes of the legitimate interests pursued by us, you may object to such processing by providing a ground related to your particular situation to justify the objection. You must know that, however, should your Personal Information be processed for direct marketing purposes, you can object to that processing at any time without providing any justification. To learn, whether we are processing Personal Information for direct marketing purposes, you may refer to the relevant sections of this document.</Text>

          <Text style={styles.subtitle}>How to exercise these rights</Text>

          <Text style={styles.contentText}>        Any requests to exercise User rights can be directed to the Owner through the contact details provided in this document. These requests can be exercised free of charge and will be addressed by the Owner as early as possible and always within one month.</Text>

          <Text style={styles.subtitle}>Privacy of children</Text>

          <Text style={styles.contentText}>        We do not knowingly collect any Personal Information from children under the age of 13. If you are under the age of 13, please do not submit any Personal Information through our Mobile Application or Service. We encourage parents and legal guardians to monitor their children's Internet usage and to help enforce this Policy by instructing their children never to provide Personal Information through our Mobile Application or Service without their permission. If you have reason to believe that a child under the age of 13 has provided Personal Information to us through our Mobile Application or Service, please contact us. You must also be at least 16 years of age to consent to the processing of your personal data in your country (in some countries we may allow your parent or guardian to do so on your behalf).</Text>

          <Text style={styles.subtitle}>Links to other mobile applications</Text>

          <Text style={styles.contentText}>        Our Mobile Application contains links to other mobile applications that are not owned or controlled by us. Please be aware that we are not responsible for the privacy practices of such other mobile applications or third-parties. We encourage you to be aware when you leave our Mobile Application and to read the privacy statements of each and every mobile application that may collect Personal Information.</Text>

          <Text style={styles.subtitle}>Information security</Text>

          <Text style={styles.contentText}>        We secure information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use, or disclosure. We maintain reasonable administrative, technical, and physical safeguards in an effort to protect against unauthorized access, use, modification, and disclosure of Personal Information in its control and custody. However, no data transmission over the Internet or wireless network can be guaranteed. Therefore, while we strive to protect your Personal Information, you acknowledge that (i) there are security and privacy limitations of the Internet which are beyond our control; (ii) the security, integrity, and privacy of any and all information and data exchanged between you and our Mobile Application cannot be guaranteed; and (iii) any such information and data may be viewed or tampered with in transit by a third-party, despite best efforts.</Text>

          <Text style={styles.subtitle}>Data breach</Text>

          <Text style={styles.contentText}>        In the event we become aware that the security of the Mobile Application has been compromised or users Personal Information has been disclosed to unrelated third parties as a result of external activity, including, but not limited to, security attacks or fraud, we reserve the right to take reasonably appropriate measures, including, but not limited to, investigation and reporting, as well as notification to and cooperation with law enforcement authorities. In the event of a data breach, we will make reasonable efforts to notify affected individuals if we believe that there is a reasonable risk of harm to the user as a result of the breach or if notice is otherwise required by law. When we do, we will post a notice in the Mobile Application.</Text>

          <Text style={styles.subtitle}>Legal disclosure</Text>

          <Text style={styles.contentText}>        We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena, or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.</Text>

          <Text style={styles.subtitle}>Changes and amendments</Text>

          <Text style={styles.contentText}>        We reserve the right to modify this Policy relating to the Mobile Application or Services at any time, effective upon posting of an updated version of this Policy in the Mobile Application. When we do we will post a notification in our Mobile Application. Continued use of the Mobile Application after any such changes shall constitute your consent to such changes. Policy was created with
            <Text onPress={() => Linking.openURL('https://www.websitepolicies.com/blog/sample-terms-conditions-template')}> WebsitePolicies</Text>.</Text>

          <Text style={styles.subtitle}>Acceptance of this policy</Text>

          <Text style={styles.contentText}>        You acknowledge that you have read this Policy and agree to all its terms and conditions. By using the Mobile Application or its Services you agree to be bound by this Policy. If you do not agree to abide by the terms of this Policy, you are not authorized to use or access the Mobile Application and its Services.</Text>

          <Text style={styles.subtitle}>Contacting us</Text>

          <Text style={styles.contentText}>        If you have any questions about this Policy, please contact us.</Text>

          <Text style={styles.contentText}>        This document was last updated on June 17, 2019</Text>

          <Text style={styles.contentText}></Text>

        </ScrollView>

        {
          this.state.scrollToEndVisible == true &&
              <Icon
                name='arrow-downward'
                size={30}
                color={Colors.white}
                containerStyle={styles.scrollToEnd}
                onPress={() => this.scrollToEnd()}
                underlayColor={Colors.customYellow}
              />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  logo: {
    alignSelf: 'center',
    height: 200,
    resizeMode: 'contain',
    marginTop: 40,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 26,
    fontFamily: 'Lato-Regular',
    paddingTop: 40,
  },
  contentText: {
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 18,
    fontFamily: 'Lato-Italic',
    paddingTop: 10,
  },
  submitBtn: {
    width: '80%',
    height: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 30,
    backgroundColor: Colors.customYellow,
  },
  submitBtnText: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  scrollToEnd: {
    borderRadius: 50,
    padding: 12,
    backgroundColor: Colors.customYellow,
    position: 'absolute',
    bottom: 18,
    right: 18,
    elevation: 3,
  },
});
