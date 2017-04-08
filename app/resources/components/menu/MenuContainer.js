import { connect } from 'react-redux';
import MenuComponent from './MenuComponent';

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

const Menu = connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuComponent);

export default Menu;