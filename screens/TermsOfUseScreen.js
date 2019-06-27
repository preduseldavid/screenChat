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

export default class TermsOfUseScreen extends Component {
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
    this.showScrollToEndTimeout = null;
  }

  componentDidMount() {
    this.showScrollToEndTimeout = setTimeout(() => this.setState({
      scrollToEndVisible: true,
      scrollToEndfunctionStarted: true }), 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.showScrollToEndTimeout);
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
          title={'Terms Of Use'}
          goBack={this.goBack}
        />;

        agreeButton =
          <TouchableOpacity
            disabled={true}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>ACCEPTED</Text>
          </TouchableOpacity>;

    }
    else {
      agreeButton =
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => this.props.acceptTermsAndConitions()}
        >
          <Text style={styles.submitBtnText}>ACCEPT & Continue</Text>
        </TouchableOpacity>;
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

          <Text style={styles.title}>Terms and conditions</Text>

          <Text style={styles.contentText}>        These terms and conditions (&quot;Terms&quot;, &quot;Agreement&quot;) are an agreement between Mobile Application Developer (&quot;Mobile Application Developer&quot;, &quot;us&quot;, &quot;we&quot; or &quot;our&quot;) and you (&quot;User&quot;, &quot;you&quot; or &quot;your&quot;). This Agreement sets forth the general terms and conditions of your use of the Screen Chat mobile application and any of its products or services (collectively, &quot;Mobile Application&quot; or &quot;Services&quot;).</Text>

          <Text style={styles.subtitle}>User content</Text>

          <Text style={styles.contentText}>        We do not own any data, information or material (&quot;Content&quot;) that you submit in the Mobile Application in the course of using the Service. You shall have sole responsibility for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to use of all submitted Content. We may, but have no obligation to, monitor and review Content in the Mobile Application submitted or created using our Services by you. Unless specifically permitted by you, your use of the Mobile Application does not grant us the license to use, reproduce, adapt, modify, publish or distribute the Content created by you or stored in your user account for commercial, marketing or any similar purpose. But you grant us permission to access, copy, distribute, store, transmit, reformat, display and perform the Content of your user account solely as required for the purpose of providing the Services to you. Without limiting any of those representations or warranties, we have the right, though not the obligation, to, in our own sole discretion, refuse or remove any Content that, in our reasonable opinion, violates any of our policies or is in any way harmful or objectionable.</Text>

          <Text style={styles.subtitle}>Adult content</Text>

          <Text style={styles.contentText}>        Please be aware that there may be certain adult or mature content available in the Mobile Application. A warning will be shown to the User prior to adult content being displayed. Where there is mature or adult content, individuals who are less than 18 years of age or are not permitted to access such content under the laws of any applicable jurisdiction may not access such content. If we learn that anyone under the age of 18 seeks to conduct a transaction through the Services, we will require verified parental consent, in accordance with the Children's Online Privacy Protection Act of 1998 (&quot;COPPA&quot;). Certain areas of the Mobile Application may not be available to children under 18 under any circumstances.</Text>

          <Text style={styles.subtitle}>Backups</Text>

          <Text style={styles.contentText}>        We are not responsible for Content residing in the Mobile Application. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain appropriate backup of your Content. Notwithstanding the foregoing, on some occasions and in certain circumstances, with absolutely no obligation, we may be able to restore some or all of your data that has been deleted as of a certain date and time when we may have backed up data for our own purposes. We make no guarantee that the data you need will be available.</Text>

          <Text style={styles.subtitle}>Links to other mobile applications</Text>

          <Text style={styles.contentText}>        Although this Mobile Application may link to other mobile applications, we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked mobile application, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their mobile applications. We do not assume any responsibility or liability for the actions, products, services, and content of any other third-parties. You should carefully review the legal statements and other conditions of use of any mobile application which you access through a link from this Mobile Application. Your linking to any other off-site mobile applications is at your own risk.</Text>

          <Text style={styles.subtitle}>Prohibited uses</Text>

          <Text style={styles.contentText}>        In addition to other terms as set forth in the Agreement, you are prohibited from using the Mobile Application or its Content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related mobile application, other mobile applications, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related mobile application, other mobile applications, or the Internet. We reserve the right to terminate your use of the Service or any related mobile application for violating any of the prohibited uses.</Text>

          <Text style={styles.subtitle}>Intellectual property rights</Text>

          <Text style={styles.contentText}>        This Agreement does not transfer to you any intellectual property owned by Mobile Application Developer or third-parties, and all rights, titles, and interests in and to such property will remain (as between the parties) solely with Mobile Application Developer. All trademarks, service marks, graphics and logos used in connection with our Mobile Application or Services, are trademarks or registered trademarks of Mobile Application Developer or Mobile Application Developer licensors. Other trademarks, service marks, graphics and logos used in connection with our Mobile Application or Services may be the trademarks of other third-parties. Your use of our Mobile Application and Services grants you no right or license to reproduce or otherwise use any Mobile Application Developer or third-party trademarks.</Text>

          <Text style={styles.subtitle}>Limitation of liability</Text>

          <Text style={styles.contentText}>        To the fullest extent permitted by applicable law, in no event will Mobile Application Developer, its affiliates, officers, directors, employees, agents, suppliers or licensors be liable to any person for (a): any indirect, incidental, special, punitive, cover or consequential damages (including, without limitation, damages for lost profits, revenue, sales, goodwill, use or content, impact on business, business interruption, loss of anticipated savings, loss of business opportunity) however caused, under any theory of liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence or otherwise, even if Mobile Application Developer has been advised as to the possibility of such damages or could have foreseen such damages. To the maximum extent permitted by applicable law, the aggregate liability of Mobile Application Developer and its affiliates, officers, employees, agents, suppliers and licensors, relating to the services will be limited to an amount greater of one dollar or any amounts actually paid in cash by you to Mobile Application Developer for the prior one month period prior to the first event or occurrence giving rise to such liability. The limitations and exclusions also apply if this remedy does not fully compensate you for any losses or fails of its essential purpose.</Text>

          <Text style={styles.subtitle}>Indemnification</Text>

          <Text style={styles.contentText}>        You agree to indemnify and hold Mobile Application Developer and its affiliates, directors, officers, employees, and agents harmless from and against any liabilities, losses, damages or costs, including reasonable attorneys' fees, incurred in connection with or arising from any third-party allegations, claims, actions, disputes, or demands asserted against any of them as a result of or relating to your Content, your use of the Mobile Application or Services or any willful misconduct on your part.</Text>

          <Text style={styles.subtitle}>Severability</Text>

          <Text style={styles.contentText}>        All rights and restrictions contained in this Agreement may be exercised and shall be applicable and binding only to the extent that they do not violate any applicable laws and are intended to be limited to the extent necessary so that they will not render this Agreement illegal, invalid or unenforceable. If any provision or portion of any provision of this Agreement shall be held to be illegal, invalid or unenforceable by a court of competent jurisdiction, it is the intention of the parties that the remaining provisions or portions thereof shall constitute their agreement with respect to the subject matter hereof, and all such remaining provisions or portions thereof shall remain in full force and effect.</Text>

          <Text style={styles.subtitle}>Dispute resolution</Text>

          <Text style={styles.contentText}>        The formation, interpretation, and performance of this Agreement and any disputes arising out of it shall be governed by the substantive and procedural laws of Timiş, Romania without regard to its rules on conflicts or choice of law and, to the extent applicable, the laws of Romania. The exclusive jurisdiction and venue for actions related to the subject matter hereof shall be the state and federal courts located in Timiş, Romania, and you hereby submit to the personal jurisdiction of such courts. You hereby waive any right to a jury trial in any proceeding arising out of or related to this Agreement. The United Nations Convention on Contracts for the International Sale of Goods does not apply to this Agreement.</Text>

          <Text style={styles.subtitle}>Changes and amendments</Text>

          <Text style={styles.contentText}>        We reserve the right to modify this Agreement or its policies relating to the Mobile Application or Services at any time, effective upon posting of an updated version of this Agreement in the Mobile Application. When we do, we will post a notification in our Mobile Application. Continued use of the Mobile Application after any such changes shall constitute your consent to such changes.
          Policy was created with <Text
                onPress={() => Linking.openURL('https://www.websitepolicies.com/blog/sample-terms-conditions-template')}> WebsitePolicies</Text></Text>

          <Text style={styles.subtitle}>Acceptance of these terms</Text>

          <Text style={styles.contentText}>        You acknowledge that you have read this Agreement and agree to all its terms and conditions. By using the Mobile Application or its Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to use or access the Mobile Application and its Services.</Text>

          <Text style={styles.subtitle}>Contacting us</Text>

          <Text style={styles.contentText}>        If you have any questions about this Agreement, please contact us.</Text>

          <Text style={styles.footerText}>         This document was last updated on June 17, 2019</Text>

          {agreeButton}

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
